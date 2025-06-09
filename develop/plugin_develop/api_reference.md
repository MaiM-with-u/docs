# API参考

插件可以使用`PluginAction`基类提供的以下API方法。这些方法可以帮助插件与系统交互、发送消息、获取信息等。

## 消息发送

### 1. 直接发送消息

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

### 2. 使用表达器发送消息

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

## 信息获取

### 1. 获取聊天类型

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

### 2. 获取最近消息

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

### 3. 获取动作参数

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

### 4. 获取用户ID

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

## 模型调用

### 1. 获取可用模型

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

### 2. 使用模型生成内容

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
logger = get_logger("your_action_name")

# 在类中使用
logger.info(f"{self.log_prefix} 开始处理")
logger.warning(f"{self.log_prefix} 发现潜在问题: {issue}")
logger.error(f"{self.log_prefix} 处理失败: {e}")
```

## 属性访问

### 1. 日志前缀

```python
self.log_prefix
```

获取日志前缀，包含动作名称和会话ID，便于日志追踪。

**示例**:

```python
logger.info(f"{self.log_prefix} 处理开始")
```

### 2. 会话ID

```python
self.session_id
```

获取当前会话的唯一标识符。

**示例**:

```python
logger.debug(f"处理会话 {self.session_id} 的请求")
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