# 命令处理系统

命令处理系统是MaiBot插件系统的另一种扩展方式，它允许在消息接收的早期阶段处理特定的命令，不经过Planner系统。命令通常以"/"开头，如"/help"、"/echo"等。

## 系统架构

命令处理系统主要由以下几个部分组成：

1. **BaseCommand**：命令处理器的基类
2. **register_command**：命令注册装饰器
3. **CommandManager**：命令管理器，负责注册和调用命令
4. **消息处理流程**：在早期阶段添加命令处理逻辑

## 命令处理器基类

`BaseCommand`类是所有命令处理器的基类，提供了命令处理的基本结构：

```python
class BaseCommand:
    def __init__(self):
        self.name = ""  # 命令名称
        self.description = ""  # 命令描述
        self.usage = ""  # 使用方法

    async def execute(self, chat_stream, args):
        """
        执行命令的方法
        :param chat_stream: 聊天流对象
        :param args: 命令参数
        :return: 是否继续处理消息
        """
        pass
```

## 命令注册装饰器

`register_command`装饰器用于注册命令处理器：

```python
def register_command(name, description="", usage=""):
    """
    注册命令的装饰器
    :param name: 命令名称
    :param description: 命令描述
    :param usage: 使用方法
    """
    def decorator(cls):
        if not issubclass(cls, BaseCommand):
            raise TypeError("Command must be a subclass of BaseCommand")
        
        cls.name = name
        cls.description = description
        cls.usage = usage
        
        # 注册到命令管理器
        CommandManager.register_command(cls)
        return cls
    return decorator
```

## 命令管理器

`CommandManager`负责管理所有注册的命令：

```python
class CommandManager:
    commands = {}  # 存储所有注册的命令

    @classmethod
    def register_command(cls, command_cls):
        """
        注册命令
        :param command_cls: 命令类
        """
        instance = command_cls()
        cls.commands[instance.name] = instance
        logger.info(f"Command registered: {instance.name}")

    @classmethod
    async def process_command(cls, chat_stream, content):
        """
        处理命令
        :param chat_stream: 聊天流对象
        :param content: 消息内容
        :return: (是否是命令, 是否继续处理)
        """
        if not content.startswith("/"):
            return False, True
        
        # 解析命令和参数
        parts = content[1:].split(maxsplit=1)
        command_name = parts[0].lower()
        args = parts[1] if len(parts) > 1 else ""
        
        # 查找并执行命令
        if command_name in cls.commands:
            try:
                continue_processing = await cls.commands[command_name].execute(chat_stream, args)
                return True, continue_processing
            except Exception as e:
                logger.error(f"Error executing command {command_name}: {e}")
                await chat_stream.send_message(f"执行命令时出错: {e}")
                return True, False
        
        return False, True
```

## 在消息处理流程中集成

在消息处理的早期阶段添加命令处理：

```python
async def on_received_message(self, chat_stream):
    """
    处理接收到的消息
    :param chat_stream: 聊天流对象
    """
    content = chat_stream.message.content
    
    # 命令处理
    is_command, continue_processing = await CommandManager.process_command(chat_stream, content)
    if is_command and not continue_processing:
        return
    
    # 继续正常的消息处理流程...
```

## 示例命令

### Echo命令

```python
@register_command(
    name="echo",
    description="回显输入的内容",
    usage="/echo [文本]"
)
class EchoCommand(BaseCommand):
    async def execute(self, chat_stream, args):
        if not args:
            await chat_stream.send_message("请提供要回显的内容")
            return False
        
        await chat_stream.send_message(f"Echo: {args}")
        return False  # 不继续处理消息
```

### Help命令

```python
@register_command(
    name="help",
    description="显示可用命令列表或特定命令的帮助信息",
    usage="/help [命令名]"
)
class HelpCommand(BaseCommand):
    async def execute(self, chat_stream, args):
        if not args:
            # 显示所有命令
            commands_list = "\n".join([
                f"/{cmd.name} - {cmd.description}" 
                for cmd in CommandManager.commands.values()
            ])
            await chat_stream.send_message(f"可用命令列表:\n{commands_list}")
        else:
            # 显示特定命令的帮助
            cmd_name = args.strip().lower()
            if cmd_name in CommandManager.commands:
                cmd = CommandManager.commands[cmd_name]
                help_text = f"命令: /{cmd.name}\n描述: {cmd.description}\n用法: {cmd.usage}"
                await chat_stream.send_message(help_text)
            else:
                await chat_stream.send_message(f"未找到命令: {cmd_name}")
        
        return False  # 不继续处理消息
```

### 骰子命令

```python
@register_command(
    name="dice",
    description="投骰子",
    usage="/dice [骰子数]d[面数] 例如: /dice 2d6"
)
class DiceCommand(BaseCommand):
    async def execute(self, chat_stream, args):
        if not args:
            # 默认为1d6
            num_dice = 1
            num_sides = 6
        else:
            try:
                match = re.match(r"(\d+)d(\d+)", args)
                if match:
                    num_dice = int(match.group(1))
                    num_sides = int(match.group(2))
                else:
                    await chat_stream.send_message("格式错误，请使用如 1d6 的格式")
                    return False
            except Exception:
                await chat_stream.send_message("格式错误，请使用如 1d6 的格式")
                return False
        
        # 限制骰子数量和面数
        num_dice = min(max(1, num_dice), 100)
        num_sides = min(max(1, num_sides), 1000)
        
        # 投骰子
        results = [random.randint(1, num_sides) for _ in range(num_dice)]
        total = sum(results)
        
        # 构建结果消息
        if len(results) == 1:
            message = f"🎲 投掷 {num_sides} 面骰子: {results[0]}"
        else:
            details = " + ".join(map(str, results))
            message = f"🎲 投掷 {num_dice}d{num_sides}: {total} ({details})"
        
        await chat_stream.send_message(message)
        return False  # 不继续处理消息
```

## 命令系统与动作系统的区别

| 特性 | 命令系统 | 动作系统 |
|------|---------|---------|
| 触发方式 | 以"/"开头的特定命令 | 根据激活类型（关键词、LLM判定等） |
| 处理时机 | 消息处理早期阶段 | 经过Planner系统选择后 |
| 主要用途 | 简单、直接的功能调用 | 复杂的上下文感知功能 |
| 参数解析 | 手动解析命令参数 | 由Planner系统提供结构化参数 |
| 执行流程 | 直接执行，不经过LLM | 可能经过LLM判断和选择 |

## 最佳实践

1. **命令命名**：使用简短、明确的命令名称，避免与现有命令冲突。

2. **错误处理**：命令执行过程中应当捕获并处理可能的异常，避免影响整体消息处理流程。

3. **参数验证**：处理命令参数时需要考虑空参数的情况，避免出现`NoneType`错误。

4. **返回值**：命令执行后返回`False`表示不继续处理消息，返回`True`表示继续正常的消息处理流程。

5. **命令文档**：提供清晰的命令描述和使用方法，便于用户理解。

6. **适用场景**：
   - 使用命令系统：简单、直接的功能调用，如设置、查询、工具类功能
   - 使用动作系统：需要上下文理解的复杂功能，如对话式交互、情感分析等

## 创建自定义命令的步骤

1. 创建继承自`BaseCommand`的类
2. 使用`@register_command`装饰器注册命令
3. 实现`execute`方法处理命令逻辑
4. 将命令类放在适当的目录中（通常是`src/plugins/你的插件名/commands/`）
5. 在插件的`__init__.py`中导入命令类

```python
# src/plugins/你的插件名/commands/your_command.py
from src.command.base_command import BaseCommand, register_command

@register_command(
    name="yourcommand",
    description="你的命令描述",
    usage="/yourcommand [参数]"
)
class YourCommand(BaseCommand):
    async def execute(self, chat_stream, args):
        # 命令处理逻辑
        await chat_stream.send_message("命令执行结果")
        return False  # 不继续处理消息
```

```python
# src/plugins/你的插件名/__init__.py
from .actions.your_action import YourAction
from .commands.your_command import YourCommand

__all__ = ["YourAction", "YourCommand"]
```

命令系统提供了一种灵活的方式来扩展机器人的功能，允许用户通过简单的命令与机器人交互，而不需要复杂的对话流程。 