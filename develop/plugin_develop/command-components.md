# 💻 Command组件详解

## 📖 什么是Command

Command是直接响应用户明确指令的组件，与Action不同，Command是**被动触发**的，当用户输入特定格式的命令时立即执行。Command通过正则表达式匹配用户输入，提供确定性的功能服务。

### 🎯 Command的特点

- 🎯 **确定性执行**：匹配到命令立即执行，无随机性
- ⚡ **即时响应**：用户主动触发，快速响应
- 🔍 **正则匹配**：通过正则表达式精确匹配用户输入
- 🛑 **拦截控制**：可以控制是否阻止消息继续处理
- 📝 **参数解析**：支持从用户输入中提取参数

## 🆚 Action vs Command 核心区别

| 特征               | Action                | Command          |
| ------------------ | --------------------- | ---------------- |
| **触发方式** | 麦麦主动决策使用      | 用户主动触发     |
| **决策机制** | 两层决策（激活+使用） | 直接匹配执行     |
| **随机性**   | 有随机性和智能性      | 确定性执行       |
| **用途**     | 增强麦麦行为拟人化    | 提供具体功能服务 |
| **性能影响** | 需要LLM决策           | 正则匹配，性能好 |

## 🏗️ Command基本结构

### 必须属性

```python
from src.plugin_system import BaseCommand

class MyCommand(BaseCommand):
    # 正则表达式匹配模式
    command_pattern = r"^/help\s+(?P<topic>\w+)$"
  
    # 命令帮助说明
    command_help = "显示指定主题的帮助信息"
  
    # 使用示例
    command_examples = ["/help action", "/help command"]
  
    # 是否拦截后续处理
    intercept_message = True
  
    async def execute(self) -> Tuple[bool, Optional[str]]:
        """执行命令逻辑"""
        # 命令执行逻辑
        return True, "执行成功"
```

### 属性说明

| 属性                  | 类型      | 说明                 |
| --------------------- | --------- | -------------------- |
| `command_pattern`   | str       | 正则表达式匹配模式   |
| `command_help`      | str       | 命令帮助说明         |
| `command_examples`  | List[str] | 使用示例列表         |
| `intercept_message` | bool      | 是否拦截消息继续处理 |

## 🔍 正则表达式匹配

### 基础匹配

```python
class SimpleCommand(BaseCommand):
    # 匹配 /ping
    command_pattern = r"^/ping$"
  
    async def execute(self) -> Tuple[bool, Optional[str]]:
        await self.send_text("Pong!")
        return True, "发送了Pong回复"
```

### 参数捕获

使用命名组 `(?P<n>pattern)` 捕获参数：

```python
class UserCommand(BaseCommand):
    # 匹配 /user add 张三 或 /user del 李四
    command_pattern = r"^/user\s+(?P<action>add|del|info)\s+(?P<username>\w+)$"
  
    async def execute(self) -> Tuple[bool, Optional[str]]:
        # 通过 self.matched_groups 获取捕获的参数
        action = self.matched_groups.get("action")
        username = self.matched_groups.get("username")
      
        if action == "add":
            await self.send_text(f"添加用户：{username}")
        elif action == "del":
            await self.send_text(f"删除用户：{username}")
        elif action == "info":
            await self.send_text(f"用户信息：{username}")
      
        return True, f"执行了{action}操作"
```

### 可选参数

```python
class HelpCommand(BaseCommand):
    # 匹配 /help 或 /help topic
    command_pattern = r"^/help(?:\s+(?P<topic>\w+))?$"
  
    async def execute(self) -> Tuple[bool, Optional[str]]:
        topic = self.matched_groups.get("topic")
      
        if topic:
            await self.send_text(f"显示{topic}的帮助")
        else:
            await self.send_text("显示总体帮助")
      
        return True, "显示了帮助信息"
```

## 🛑 拦截控制详解

### 拦截消息 (intercept_message = True)

```python
class AdminCommand(BaseCommand):
    command_pattern = r"^/admin\s+.+"
    command_help = "管理员命令"
    intercept_message = True  # 拦截，不继续处理
  
    async def execute(self) -> Tuple[bool, Optional[str]]:
        # 执行管理操作
        await self.send_text("执行管理命令")
        # 消息不会继续传递给其他组件
        return True, "管理命令执行完成"
```

### 不拦截消息 (intercept_message = False)

```python
class LogCommand(BaseCommand):
    command_pattern = r"^/log\s+.+"
    command_help = "记录日志"
    intercept_message = False  # 不拦截，继续处理
  
    async def execute(self) -> Tuple[bool, Optional[str]]:
        # 记录日志但不阻止后续处理
        await self.send_text("已记录到日志")
        # 消息会继续传递，可能触发Action等其他组件
        return True, "日志记录完成"
```

### 拦截控制的用途

| 场景     | intercept_message | 说明                       |
| -------- | ----------------- | -------------------------- |
| 系统命令 | True              | 防止命令被当作普通消息处理 |
| 查询命令 | True              | 直接返回结果，无需后续处理 |
| 日志命令 | False             | 记录但允许消息继续流转     |
| 监控命令 | False             | 监控但不影响正常聊天       |

## 🎨 完整Command示例

### 用户管理Command

```python
from src.plugin_system import BaseCommand
from typing import Tuple, Optional

class UserManagementCommand(BaseCommand):
    """用户管理Command - 展示复杂参数处理"""

    command_pattern = r"^/user\s+(?P<action>add|del|list|info)\s*(?P<username>\w+)?(?:\s+--(?P<options>.+))?$"
    command_help = "用户管理命令，支持添加、删除、列表、信息查询"
    command_examples = [
        "/user add 张三",
        "/user del 李四", 
        "/user list",
        "/user info 王五",
        "/user add 赵六 --role=admin"
    ]
    intercept_message = True

    async def execute(self) -> Tuple[bool, Optional[str]]:
        """执行用户管理命令"""
        try:
            action = self.matched_groups.get("action")
            username = self.matched_groups.get("username")
            options = self.matched_groups.get("options")

            # 解析选项
            parsed_options = self._parse_options(options) if options else {}

            if action == "add":
                return await self._add_user(username, parsed_options)
            elif action == "del":
                return await self._delete_user(username)
            elif action == "list":
                return await self._list_users()
            elif action == "info":
                return await self._show_user_info(username)
            else:
                await self.send_text("❌ 不支持的操作")
                return False, f"不支持的操作: {action}"

        except Exception as e:
            await self.send_text(f"❌ 命令执行失败: {str(e)}")
            return False, f"执行失败: {e}"

    def _parse_options(self, options_str: str) -> dict:
        """解析命令选项"""
        options = {}
        if options_str:
            for opt in options_str.split():
                if "=" in opt:
                    key, value = opt.split("=", 1)
                    options[key] = value
        return options

    async def _add_user(self, username: str, options: dict) -> Tuple[bool, str]:
        """添加用户"""
        if not username:
            await self.send_text("❌ 请指定用户名")
            return False, "缺少用户名参数"

        # 检查用户是否已存在
        existing_users = await self._get_user_list()
        if username in existing_users:
            await self.send_text(f"❌ 用户 {username} 已存在")
            return False, f"用户已存在: {username}"

        # 添加用户逻辑
        role = options.get("role", "user")
        await self.send_text(f"✅ 成功添加用户 {username}，角色: {role}")
        return True, f"添加用户成功: {username}"

    async def _delete_user(self, username: str) -> Tuple[bool, str]:
        """删除用户"""
        if not username:
            await self.send_text("❌ 请指定用户名")
            return False, "缺少用户名参数"

        await self.send_text(f"✅ 用户 {username} 已删除")
        return True, f"删除用户成功: {username}"

    async def _list_users(self) -> Tuple[bool, str]:
        """列出所有用户"""
        users = await self._get_user_list()
        if users:
            user_list = "\n".join([f"• {user}" for user in users])
            await self.send_text(f"📋 用户列表:\n{user_list}")
        else:
            await self.send_text("📋 暂无用户")
        return True, "显示用户列表"

    async def _show_user_info(self, username: str) -> Tuple[bool, str]:
        """显示用户信息"""
        if not username:
            await self.send_text("❌ 请指定用户名")
            return False, "缺少用户名参数"

        # 模拟用户信息
        user_info = f"""
👤 用户信息: {username}
📧 邮箱: {username}@example.com
🕒 注册时间: 2024-01-01
🎯 角色: 普通用户
        """.strip()
      
        await self.send_text(user_info)
        return True, f"显示用户信息: {username}"

    async def _get_user_list(self) -> list:
        """获取用户列表（示例）"""
        return ["张三", "李四", "王五"]
```

### 系统信息Command

```python
class SystemInfoCommand(BaseCommand):
    """系统信息Command - 展示系统查询功能"""

    command_pattern = r"^/(?:status|info)(?:\s+(?P<type>system|memory|plugins|all))?$"
    command_help = "查询系统状态信息"
    command_examples = [
        "/status",
        "/info system",
        "/status memory",
        "/info plugins"
    ]
    intercept_message = True

    async def execute(self) -> Tuple[bool, Optional[str]]:
        """执行系统信息查询"""
        info_type = self.matched_groups.get("type", "all")

        try:
            if info_type in ["system", "all"]:
                await self._show_system_info()
          
            if info_type in ["memory", "all"]:
                await self._show_memory_info()
          
            if info_type in ["plugins", "all"]:
                await self._show_plugin_info()

            return True, f"显示了{info_type}类型的系统信息"

        except Exception as e:
            await self.send_text(f"❌ 获取系统信息失败: {str(e)}")
            return False, f"查询失败: {e}"

    async def _show_system_info(self):
        """显示系统信息"""
        import platform
        import datetime

        system_info = f"""
🖥️ **系统信息**
📱 平台: {platform.system()} {platform.release()}
🐍 Python: {platform.python_version()}
⏰ 运行时间: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """.strip()
      
        await self.send_text(system_info)

    async def _show_memory_info(self):
        """显示内存信息"""
        import psutil
      
        memory = psutil.virtual_memory()
        memory_info = f"""
💾 **内存信息**
📊 总内存: {memory.total // (1024**3)} GB
🟢 可用内存: {memory.available // (1024**3)} GB  
📈 使用率: {memory.percent}%
        """.strip()
      
        await self.send_text(memory_info)

    async def _show_plugin_info(self):
        """显示插件信息"""
        # 通过配置获取插件信息
        plugins = await self._get_loaded_plugins()
      
        plugin_info = f"""
🔌 **插件信息**
📦 已加载插件: {len(plugins)}
🔧 活跃插件: {len([p for p in plugins if p.get('active', False)])}
        """.strip()
      
        await self.send_text(plugin_info)

    async def _get_loaded_plugins(self) -> list:
        """获取已加载的插件列表"""
        # 这里可以通过配置或API获取实际的插件信息
        return [
            {"name": "core_actions", "active": True},
            {"name": "example_plugin", "active": True},
        ]
```

### 自定义前缀Command

```python
class CustomPrefixCommand(BaseCommand):
    """自定义前缀Command - 展示非/前缀的命令"""

    # 使用!前缀而不是/前缀
    command_pattern = r"^[!！](?P<command>roll|dice)\s*(?P<count>\d+)?$"
    command_help = "骰子命令，使用!前缀"
    command_examples = ["!roll", "!dice 6", "！roll 20"]
    intercept_message = True

    async def execute(self) -> Tuple[bool, Optional[str]]:
        """执行骰子命令"""
        import random
      
        command = self.matched_groups.get("command")
        count = int(self.matched_groups.get("count", "6"))
      
        # 限制骰子面数
        if count > 100:
            await self.send_text("❌ 骰子面数不能超过100")
            return False, "骰子面数超限"
      
        result = random.randint(1, count)
        await self.send_text(f"🎲 投掷{count}面骰子，结果: {result}")
      
        return True, f"投掷了{count}面骰子，结果{result}"
```

## 📊 性能优化建议

### 1. 正则表达式优化

```python
# ✅ 好的做法 - 简单直接
command_pattern = r"^/ping$"

# ❌ 避免 - 过于复杂
command_pattern = r"^/(?:ping|pong|test|check|status|info|help|...)"

# ✅ 好的做法 - 分离复杂逻辑
```

### 2. 参数验证

```python
# ✅ 好的做法 - 早期验证
async def execute(self) -> Tuple[bool, Optional[str]]:
    username = self.matched_groups.get("username")
    if not username:
        await self.send_text("❌ 请提供用户名")
        return False, "缺少参数"
  
    # 继续处理...
```

### 3. 错误处理

```python
# ✅ 好的做法 - 完整错误处理
async def execute(self) -> Tuple[bool, Optional[str]]:
    try:
        # 主要逻辑
        result = await self._process_command()
        return True, "执行成功"
    except ValueError as e:
        await self.send_text(f"❌ 参数错误: {e}")
        return False, f"参数错误: {e}"
    except Exception as e:
        await self.send_text(f"❌ 执行失败: {e}")
        return False, f"执行失败: {e}"
```

## 🎯 最佳实践

### 1. 命令设计原则

```python
# ✅ 好的命令设计
"/user add 张三"          # 动作 + 对象 + 参数
"/config set key=value"   # 动作 + 子动作 + 参数
"/help command"           # 动作 + 可选参数

# ❌ 避免的设计
"/add_user_with_name_张三" # 过于冗长
"/u a 张三"               # 过于简写
```

### 2. 帮助信息

```python
class WellDocumentedCommand(BaseCommand):
    command_pattern = r"^/example\s+(?P<param>\w+)$"
    command_help = "示例命令：处理指定参数并返回结果"
    command_examples = [
        "/example test",
        "/example debug",
        "/example production"
    ]
```

### 3. 错误处理

```python
async def execute(self) -> Tuple[bool, Optional[str]]:
    param = self.matched_groups.get("param")
  
    # 参数验证
    if param not in ["test", "debug", "production"]:
        await self.send_text("❌ 无效的参数，支持: test, debug, production")
        return False, "无效参数"
  
    # 执行逻辑
    try:
        result = await self._process_param(param)
        await self.send_text(f"✅ 处理完成: {result}")
        return True, f"处理{param}成功"
    except Exception as e:
        await self.send_text("❌ 处理失败，请稍后重试")
        return False, f"处理失败: {e}"
```

### 4. 配置集成

```python
async def execute(self) -> Tuple[bool, Optional[str]]:
    # 从配置读取设置
    max_items = self.get_config("command.max_items", 10)
    timeout = self.get_config("command.timeout", 30)
  
    # 使用配置进行处理
    ...
```

## 📝 Command vs Action 选择指南

### 使用Command的场景

- ✅ 用户需要明确调用特定功能
- ✅ 需要精确的参数控制
- ✅ 管理和配置操作
- ✅ 查询和信息显示
- ✅ 系统维护命令

### 使用Action的场景

- ✅ 增强麦麦的智能行为
- ✅ 根据上下文自动触发
- ✅ 情绪和表情表达
- ✅ 智能建议和帮助
- ✅ 随机化的互动


