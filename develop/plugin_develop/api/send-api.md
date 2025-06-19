# 消息发送API

消息发送API模块专门负责发送各种类型的消息，支持文本、表情包、图片等多种消息类型。

## 导入方式

```python
from src.plugin_system.apis import send_api
```

## 主要功能

### 1. 文本消息发送

#### `text_to_group(text, group_id, platform="qq", typing=False, reply_to="", storage_message=True)`
向群聊发送文本消息

**参数：**
- `text`：要发送的文本内容
- `group_id`：群聊ID
- `platform`：平台，默认为"qq"
- `typing`：是否显示正在输入
- `reply_to`：回复消息的格式，如"发送者:消息内容"
- `storage_message`：是否存储到数据库

**返回：**
- `bool`：是否发送成功

#### `text_to_user(text, user_id, platform="qq", typing=False, reply_to="", storage_message=True)`
向用户发送私聊文本消息

**参数与返回值同上**

### 2. 表情包发送

#### `emoji_to_group(emoji_base64, group_id, platform="qq", storage_message=True)`
向群聊发送表情包

**参数：**
- `emoji_base64`：表情包的base64编码
- `group_id`：群聊ID
- `platform`：平台，默认为"qq"
- `storage_message`：是否存储到数据库

#### `emoji_to_user(emoji_base64, user_id, platform="qq", storage_message=True)`
向用户发送表情包

### 3. 图片发送

#### `image_to_group(image_base64, group_id, platform="qq", storage_message=True)`
向群聊发送图片

#### `image_to_user(image_base64, user_id, platform="qq", storage_message=True)`
向用户发送图片

### 4. 命令发送

#### `command_to_group(command, group_id, platform="qq", storage_message=True)`
向群聊发送命令

#### `command_to_user(command, user_id, platform="qq", storage_message=True)`
向用户发送命令

### 5. 自定义消息发送

#### `custom_to_group(message_type, content, group_id, platform="qq", display_message="", typing=False, reply_to="", storage_message=True)`
向群聊发送自定义类型消息

#### `custom_to_user(message_type, content, user_id, platform="qq", display_message="", typing=False, reply_to="", storage_message=True)`
向用户发送自定义类型消息

#### `custom_message(message_type, content, target_id, is_group=True, platform="qq", display_message="", typing=False, reply_to="", storage_message=True)`
通用的自定义消息发送

**参数：**
- `message_type`：消息类型，如"text"、"image"、"emoji"等
- `content`：消息内容
- `target_id`：目标ID（群ID或用户ID）
- `is_group`：是否为群聊
- `platform`：平台
- `display_message`：显示消息
- `typing`：是否显示正在输入
- `reply_to`：回复消息
- `storage_message`：是否存储

## 使用示例

### 1. 基础文本发送

```python
from src.plugin_system.apis import send_api

async def send_hello(chat_stream):
    """发送问候消息"""
    
    if chat_stream.group_info:
        # 群聊
        success = await send_api.text_to_group(
            text="大家好！",
            group_id=chat_stream.group_info.group_id,
            typing=True
        )
    else:
        # 私聊
        success = await send_api.text_to_user(
            text="你好！",
            user_id=chat_stream.user_info.user_id,
            typing=True
        )
    
    return success
```

### 2. 回复特定消息

```python
async def reply_to_message(chat_stream, reply_text, original_sender, original_message):
    """回复特定消息"""
    
    # 构建回复格式
    reply_to = f"{original_sender}:{original_message}"
    
    if chat_stream.group_info:
        success = await send_api.text_to_group(
            text=reply_text,
            group_id=chat_stream.group_info.group_id,
            reply_to=reply_to
        )
    else:
        success = await send_api.text_to_user(
            text=reply_text,
            user_id=chat_stream.user_info.user_id,
            reply_to=reply_to
        )
    
    return success
```

### 3. 发送表情包

```python
async def send_emoji_reaction(chat_stream, emotion):
    """根据情感发送表情包"""
    
    from src.plugin_system.apis import emoji_api
    
    # 获取表情包
    emoji_result = await emoji_api.get_by_emotion(emotion)
    if not emoji_result:
        return False
    
    emoji_base64, description, matched_emotion = emoji_result
    
    # 发送表情包
    if chat_stream.group_info:
        success = await send_api.emoji_to_group(
            emoji_base64=emoji_base64,
            group_id=chat_stream.group_info.group_id
        )
    else:
        success = await send_api.emoji_to_user(
            emoji_base64=emoji_base64,
            user_id=chat_stream.user_info.user_id
        )
    
    return success
```

### 4. 在Action中发送消息

```python
from src.plugin_system.base import BaseAction

class MessageAction(BaseAction):
    async def execute(self, action_data, chat_stream):
        message_type = action_data.get("type", "text")
        content = action_data.get("content", "")
        
        if message_type == "text":
            success = await self.send_text(chat_stream, content)
        elif message_type == "emoji":
            success = await self.send_emoji(chat_stream, content)
        elif message_type == "image":
            success = await self.send_image(chat_stream, content)
        else:
            success = False
        
        return {"success": success}
    
    async def send_text(self, chat_stream, text):
        if chat_stream.group_info:
            return await send_api.text_to_group(text, chat_stream.group_info.group_id)
        else:
            return await send_api.text_to_user(text, chat_stream.user_info.user_id)
    
    async def send_emoji(self, chat_stream, emoji_base64):
        if chat_stream.group_info:
            return await send_api.emoji_to_group(emoji_base64, chat_stream.group_info.group_id)
        else:
            return await send_api.emoji_to_user(emoji_base64, chat_stream.user_info.user_id)
    
    async def send_image(self, chat_stream, image_base64):
        if chat_stream.group_info:
            return await send_api.image_to_group(image_base64, chat_stream.group_info.group_id)
        else:
            return await send_api.image_to_user(image_base64, chat_stream.user_info.user_id)
```

### 5. 批量发送消息

```python
async def broadcast_message(message: str, target_groups: list):
    """向多个群组广播消息"""
    
    results = {}
    
    for group_id in target_groups:
        try:
            success = await send_api.text_to_group(
                text=message,
                group_id=group_id,
                typing=True
            )
            results[group_id] = success
        except Exception as e:
            results[group_id] = False
            print(f"发送到群 {group_id} 失败: {e}")
    
    return results
```

### 6. 智能消息发送

```python
async def smart_send(chat_stream, message_data):
    """智能发送不同类型的消息"""
    
    message_type = message_data.get("type", "text")
    content = message_data.get("content", "")
    options = message_data.get("options", {})
    
    # 根据聊天流类型选择发送方法
    target_id = (chat_stream.group_info.group_id if chat_stream.group_info 
                else chat_stream.user_info.user_id)
    is_group = chat_stream.group_info is not None
    
    # 使用通用发送方法
    success = await send_api.custom_message(
        message_type=message_type,
        content=content,
        target_id=target_id,
        is_group=is_group,
        typing=options.get("typing", False),
        reply_to=options.get("reply_to", ""),
        display_message=options.get("display_message", "")
    )
    
    return success
```

## 消息类型说明

### 支持的消息类型
- `"text"`：纯文本消息
- `"emoji"`：表情包消息
- `"image"`：图片消息
- `"command"`：命令消息
- `"video"`：视频消息（如果支持）
- `"audio"`：音频消息（如果支持）

### 回复格式
回复消息使用格式：`"发送者:消息内容"` 或 `"发送者：消息内容"`

系统会自动查找匹配的原始消息并进行回复。

## 高级用法

### 1. 消息发送队列

```python
import asyncio

class MessageQueue:
    def __init__(self):
        self.queue = asyncio.Queue()
        self.running = False
    
    async def add_message(self, chat_stream, message_type, content, options=None):
        """添加消息到队列"""
        message_item = {
            "chat_stream": chat_stream,
            "type": message_type,
            "content": content,
            "options": options or {}
        }
        await self.queue.put(message_item)
    
    async def process_queue(self):
        """处理消息队列"""
        self.running = True
        
        while self.running:
            try:
                message_item = await asyncio.wait_for(self.queue.get(), timeout=1.0)
                
                # 发送消息
                success = await smart_send(
                    message_item["chat_stream"],
                    {
                        "type": message_item["type"],
                        "content": message_item["content"],
                        "options": message_item["options"]
                    }
                )
                
                # 标记任务完成
                self.queue.task_done()
                
                # 发送间隔
                await asyncio.sleep(0.5)
                
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                print(f"处理消息队列出错: {e}")
```

### 2. 消息模板系统

```python
class MessageTemplate:
    def __init__(self):
        self.templates = {
            "welcome": "欢迎 {nickname} 加入群聊！",
            "goodbye": "{nickname} 离开了群聊。",
            "notification": "🔔 通知：{message}",
            "error": "❌ 错误：{error_message}",
            "success": "✅ 成功：{message}"
        }
    
    def format_message(self, template_name: str, **kwargs) -> str:
        """格式化消息模板"""
        template = self.templates.get(template_name, "{message}")
        return template.format(**kwargs)
    
    async def send_template(self, chat_stream, template_name: str, **kwargs):
        """发送模板消息"""
        message = self.format_message(template_name, **kwargs)
        
        if chat_stream.group_info:
            return await send_api.text_to_group(message, chat_stream.group_info.group_id)
        else:
            return await send_api.text_to_user(message, chat_stream.user_info.user_id)

# 使用示例
template_system = MessageTemplate()
await template_system.send_template(chat_stream, "welcome", nickname="张三")
```

## 注意事项

1. **异步操作**：所有发送函数都是异步的，必须使用`await`
2. **错误处理**：发送失败时返回False，成功时返回True
3. **发送频率**：注意控制发送频率，避免被平台限制
4. **内容限制**：注意平台对消息内容和长度的限制
5. **权限检查**：确保机器人有发送消息的权限
6. **编码格式**：图片和表情包需要使用base64编码
7. **存储选项**：可以选择是否将发送的消息存储到数据库 