# API参考

本文档提供了MaiBot插件系统可用的API方法。这些方法可以帮助插件与系统交互、发送消息、获取信息等。

## 动作(Action)系统API

以下API可用于`PluginAction`类的实现中：

### 消息发送

#### 1. 直接发送消息

```python
await self.send_message(type="text", data="你好")
```

直接发送原始消息，不经过表达器处理。

**参数**:
- `type` (str): 消息类型，可以是"text"、"image"、"command"等
- `data` (Any): 消息内容，根据类型不同而不同
- `display_message` (str, 可选): 显示给用户的消息（命令类型时有用）

**示例**:

```python
# 发送文本
await self.send_message(type="text", data="你好")

# 发送图片
await self.send_message(type="image", data=base64_image_string)

# 发送命令（需要adapter支持）
await self.send_message(
    type="command",
    data={"name": "GROUP_BAN", "args": {"qq_id": str(user_id), "duration": duration_str}},
    display_message=f"我禁言了 {target} {duration_str}秒",
)
```

#### 2. 使用表达器发送消息

```python
await self.send_message_by_expressor("你好")
```

将消息通过表达器发送，使用LLM组织成符合bot语言风格的内容并发送。

**参数**:
- `message` (str): 要发送的文本消息

**示例**:

```python
await self.send_message_by_expressor("你好")
await self.send_message_by_expressor(f"禁言{target} {duration}秒，因为{reason}")
```

**注意**：表达器只能发送文本消息，不支持其他类型。

### 信息获取

#### 1. 获取聊天类型

```python
chat_type = self.get_chat_type()
```

获取当前聊天的类型。

**返回值**:
- `str`: "group"（群聊）、"private"（私聊）或"unknown"（未知）

**示例**:

```python
chat_type = self.get_chat_type()
if chat_type == "group":
    # 群聊逻辑
elif chat_type == "private":
    # 私聊逻辑
```

#### 2. 获取最近消息

```python
messages = self.get_recent_messages(count=5)
```

获取最近的消息历史。

**参数**:
- `count` (int): 要获取的消息数量

**返回值**:
- `list`: 消息列表，每条消息是一个字典，包含sender、content和timestamp

**示例**:

```python
messages = self.get_recent_messages(count=5)
for msg in messages:
    sender = msg["sender"]
    content = msg["content"]
    timestamp = msg["timestamp"]
    # 处理消息...
```

#### 3. 获取动作参数

```python
param_value = self.action_data.get("param_name", "默认值")
```

获取Planner传递给动作的参数。

**参数**:
- `key` (str): 参数名
- `default` (Any, 可选): 默认值，如果参数不存在则返回此值

**返回值**:
- `Any`: 参数值或默认值

**示例**:

```python
target = self.action_data.get("target", "")
duration = self.action_data.get("duration", "60")
reason = self.action_data.get("reason", "未指定原因")
```

#### 4. 获取用户ID

```python
platform, user_id = await self.get_user_id_by_person_name("用户名")
```

根据用户名获取平台和用户ID。

**参数**:
- `person_name` (str): 用户名或用户标识

**返回值**:
- `tuple`: (平台, 用户ID)

**示例**:

```python
try:
    platform, user_id = await self.get_user_id_by_person_name(target)
    # 使用用户ID进行操作
except Exception as e:
    logger.error(f"{self.log_prefix} 获取用户ID失败: {e}")
```

### 模型调用

#### 1. 获取可用模型

```python
models = self.get_available_models()
```

获取系统中所有可用的模型配置。

**返回值**:
- `dict`: 模型名称到模型配置的映射

**示例**:

```python
models = self.get_available_models()
# 查看可用模型
for model_name, config in models.items():
    logger.info(f"可用模型: {model_name}")
```

#### 2. 使用模型生成内容

```python
success, response, reasoning, model_name = await self.generate_with_model(
    prompt="你的提示词",
    model_config=models["model_name"],
    max_tokens=2000
)
```

使用指定的模型生成内容。

**参数**:
- `prompt` (str): 提示词
- `model_config` (dict): 模型配置，从get_available_models获取
- `max_tokens` (int, 可选): 最大生成token数
- `request_type` (str, 可选): 请求类型标识
- `temperature` (float, 可选): 温度参数
- 其他模型特定参数...

**返回值**:
- `tuple`: (成功标志, 响应内容, 推理过程, 使用的模型名称)

**示例**:

```python
models = self.get_available_models()
success, response, reasoning, model_name = await self.generate_with_model(
    prompt="分析以下文本的情感: " + text,
    model_config=models["gpt-3.5-turbo"],
    max_tokens=500,
    temperature=0.7
)

if success:
    return True, f"分析结果: {response}"
else:
    return False, "分析失败"
```

### 动作存储功能

#### 存储动作信息

```python
await self.store_action_info(
    action_build_into_prompt=False,
    action_prompt_display="动作描述",
    action_done=True
)
```

将动作执行的信息记录到数据库中，用于历史记录和上下文构建。

**参数**:
- `action_build_into_prompt` (bool): 是否构建到提示中，当设置为`True`时，该动作信息将被包含在后续与LLM的对话中
- `action_prompt_display` (str): 动作在提示中的显示内容，人类可读的描述
- `action_done` (bool): 动作是否已完成，默认为`True`

**存储内容**:
- 动作ID（基于时间戳和thinking_id生成）
- 执行时间
- 动作名称
- 动作数据
- 执行状态
- 是否构建到提示中
- 动作提示显示内容
- 聊天上下文信息

**示例**:

```python
# 执行禁言操作后存储信息
await self.send_message(
    type="command",
    data={"name": "GROUP_BAN", "args": {"qq_id": str(user_id), "duration": duration_str}},
    display_message=f"尝试禁言了 {target} {time_str}",
)

# 存储动作信息到数据库
await self.store_action_info(
    action_build_into_prompt=False,  # 不将禁言动作构建到提示中
    action_prompt_display=f"你尝试禁言了 {target} {time_str}，理由：{reason}",
    action_done=True
)
```

**应用场景**:
- **动作历史记录**：记录机器人执行过的所有动作，便于审计和调试
- **上下文构建**：通过`action_build_into_prompt=True`，将重要的动作信息加入到与LLM的对话上下文中
- **用户交互历史**：记录机器人与用户的交互历史
- **动作状态追踪**：通过`action_done`参数追踪动作的执行状态

**最佳实践**:
- 只有对后续对话有重要影响的动作才应设置`action_build_into_prompt=True`
- 提供清晰的`action_prompt_display`，使用人类可读的格式
- 避免在动作数据中存储大量信息

## 命令(Command)系统API

以下API可用于`BaseCommand`类的实现中：

### 消息发送

#### 发送消息

```python
await chat_stream.send_message("消息内容")
```

向用户发送消息。

**参数**:
- `message` (str): 要发送的消息内容

**示例**:

```python
await chat_stream.send_message("命令执行成功")
await chat_stream.send_message(f"投掷骰子结果: {result}")
```

### 参数处理

命令参数通过`execute`方法的`args`参数传递，通常需要手动解析。

**示例**:

```python
async def execute(self, chat_stream, args):
    # 解析参数
    if not args:
        # 处理空参数情况
        await chat_stream.send_message("请提供参数")
        return False
        
    # 处理参数
    parts = args.split()
    first_arg = parts[0] if parts else ""
    second_arg = parts[1] if len(parts) > 1 else ""
    
    # 使用参数
    await chat_stream.send_message(f"参数1: {first_arg}, 参数2: {second_arg}")
    return False
```

### 返回值

`execute`方法的返回值决定是否继续处理消息：

- `True`: 继续正常的消息处理流程（通常不使用）
- `False`: 不继续处理消息（大多数命令使用这个）

**示例**:

```python
async def execute(self, chat_stream, args):
    await chat_stream.send_message("命令已执行")
    return False  # 不继续处理消息
```

## 日志记录

```python
logger.info(f"{self.log_prefix} 你的日志信息")
```

记录日志信息，便于调试和监控。

**方法**:
- `logger.debug()`: 调试信息
- `logger.info()`: 一般信息
- `logger.warning()`: 警告信息
- `logger.error()`: 错误信息
- `logger.critical()`: 严重错误信息

**示例**:

```python
# 在动作类中
logger = get_logger("your_action_name")
logger.info(f"{self.log_prefix} 开始处理")

# 在命令类中
logger = get_logger("your_command_name")
logger.info(f"执行命令: {args}")
```

## 属性访问

### 动作类属性

```python
self.log_prefix  # 日志前缀
self.session_id  # 会话ID
```

### 命令类属性

```python
self.name        # 命令名称
self.description # 命令描述
self.usage       # 使用方法
```

## 最佳实践

1. **异常处理**：所有API调用都应该包含适当的异常处理
   ```python
   try:
       result = await self.some_api_call()
   except Exception as e:
       logger.error(f"{self.log_prefix} 调用失败: {e}")
       return False, "操作失败"
   ```

2. **参数验证**：始终检查必要参数是否存在
   ```python
   target = self.action_data.get("target", "")
   if not target:
       return False, "缺少目标参数"
   ```

3. **日志记录**：使用适当的日志级别记录信息
   ```python
   logger.debug("详细调试信息")  # 开发时有用
   logger.info("一般操作信息")   # 常规操作记录
   logger.error("错误信息")      # 错误和异常
   ```

4. **资源释放**：确保正确释放资源
   ```python
   async with some_resource as res:
       # 使用资源
       pass
   # 资源自动释放
   ``` 