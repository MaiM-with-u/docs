# 📡 消息API

## 📖 概述

消息API提供了发送各种类型消息的接口，支持文本、表情、图片等多种消息类型。新版API格式更加简洁直观，自动处理群聊/私聊判断。

## 🔄 基础消息发送

### 发送文本消息

```python
# 新API格式 - 自动判断群聊/私聊
await self.send_text("这是一条文本消息")

# 发送多行文本
message = """
这是第一行
这是第二行
这是第三行
"""
await self.send_text(message.strip())
```

### 发送表情消息

```python
# 新API格式 - 发送表情
await self.send_emoji("😊")
await self.send_emoji("🎉") 
await self.send_emoji("👋")
```

### 发送特定类型消息

```python
# 发送图片
await self.send_type("image", "https://example.com/image.jpg")

# 发送音频
await self.send_type("audio", "audio_file_path")

# 发送视频
await self.send_type("video", "video_file_path")

# 发送文件
await self.send_type("file", "file_path")
```

## 🎯 跨目标消息发送

### 使用send_api模块发送消息

```python
# 导入send_api
from src.plugin_system.apis import send_api

# 向指定群聊发送文本消息
success = await send_api.text_to_group(
    text="这是发送到群聊的消息",
    group_id="123456789",
    platform="qq"
)

# 向指定用户发送私聊消息
success = await send_api.text_to_user(
    text="这是私聊消息",
    user_id="987654321", 
    platform="qq"
)

# 向指定群聊发送表情
success = await send_api.emoji_to_group(
    emoji="😊",
    group_id="123456789",
    platform="qq"
)

# 向指定用户发送表情
success = await send_api.emoji_to_user(
    emoji="🎉",
    user_id="987654321",
    platform="qq"
)
```

### 通用目标消息发送

```python
# 向任意目标发送任意类型消息
success = await send_api.message_to_target(
    message_type="text",           # 消息类型
    content="消息内容",            # 消息内容
    platform="qq",                # 平台
    target_id="123456789",        # 目标ID
    is_group=True,                # 是否为群聊
    display_message="显示消息"     # 可选：显示消息
)
```

## 📨 消息类型支持

### 支持的消息类型

| 类型 | 说明 | 新API方法 | send_api方法 |
|-----|------|----------|-------------|
| `text` | 普通文本消息 | `await self.send_text()` | `await send_api.text_to_group()` |
| `emoji` | 表情消息 | `await self.send_emoji()` | `await send_api.emoji_to_group()` |
| `image` | 图片消息 | `await self.send_type("image", url)` | `await send_api.message_to_target()` |
| `audio` | 音频消息 | `await self.send_type("audio", path)` | `await send_api.message_to_target()` |
| `video` | 视频消息 | `await self.send_type("video", path)` | `await send_api.message_to_target()` |
| `file` | 文件消息 | `await self.send_type("file", path)` | `await send_api.message_to_target()` |

### 新API格式示例

```python
class ExampleAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 文本消息 - 最常用
        await self.send_text("普通文本消息")
        
        # 表情消息 - 直接方法
        await self.send_emoji("🎉")
        
        # 图片消息
        await self.send_type("image", "/path/to/image.jpg")
        
        # 音频消息
        await self.send_type("audio", "/path/to/audio.mp3")
        
        # 文件消息
        await self.send_type("file", "/path/to/document.pdf")
        
        return True, "发送了多种类型的消息"
```

## 🔍 消息信息获取

### 获取当前消息信息

```python
# 新API格式 - 直接属性访问
class ExampleCommand(BaseCommand):
    async def execute(self) -> Tuple[bool, str]:
        # 用户信息
        user_id = self.user_id
        user_nickname = self.user_nickname
        
        # 聊天信息
        is_group_chat = self.is_group
        chat_id = self.chat_id
        platform = self.platform
        
        # 消息内容
        message_text = self.message.processed_plain_text
        
        # 构建信息显示
        info = f"""
👤 用户: {user_nickname}({user_id})
💬 类型: {'群聊' if is_group_chat else '私聊'}
📱 平台: {platform}
📝 内容: {message_text}
        """.strip()
        
        await self.send_text(info)
        return True, "显示了消息信息"
```

### 获取群聊信息（如果适用）

```python
# 在Action或Command中检查群聊信息
if self.is_group:
    group_info = self.message.message_info.group_info
    if group_info:
        group_id = group_info.group_id
        group_name = getattr(group_info, 'group_name', '未知群聊')
        
        await self.send_text(f"当前群聊: {group_name}({group_id})")
else:
    await self.send_text("当前是私聊对话")
```

## 🌐 平台支持

### 支持的平台

| 平台 | 标识 | 说明 |
|-----|------|------|
| QQ | `qq` | QQ聊天平台 |
| 微信 | `wechat` | 微信聊天平台 |
| Discord | `discord` | Discord聊天平台 |

### 平台适配示例

```python
class PlatformAdaptiveAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 获取当前平台
        current_platform = self.platform
        
        # 根据平台调整消息格式
        if current_platform == "qq":
            await self.send_text("[QQ] 这是QQ平台的消息")
            await self.send_emoji("🐧")  # QQ企鹅表情
        elif current_platform == "wechat":
            await self.send_text("【微信】这是微信平台的消息")
            await self.send_emoji("💬")  # 微信气泡表情
        elif current_platform == "discord":
            await self.send_text("**Discord** 这是Discord平台的消息")
            await self.send_emoji("🎮")  # Discord游戏表情
        else:
            await self.send_text(f"未知平台: {current_platform}")
        
        return True, f"发送了{current_platform}平台适配消息"
```

## 🎨 消息格式化和高级功能

### 长消息分割

```python
# 自动处理长消息分割
long_message = "这是一条很长的消息..." * 100

# 新API会自动处理长消息分割
await self.send_text(long_message)
```

### 消息模板和格式化

```python
class TemplateMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 使用配置中的消息模板
        template = self.get_config("messages.greeting_template", "你好 {username}！")
        
        # 格式化消息
        formatted_message = template.format(
            username=self.user_nickname,
            time=datetime.now().strftime("%H:%M"),
            platform=self.platform
        )
        
        await self.send_text(formatted_message)
        
        # 根据配置决定是否发送表情
        if self.get_config("messages.include_emoji", True):
            await self.send_emoji("😊")
        
        return True, "发送了模板化消息"
```

### 条件消息发送

```python
class ConditionalMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 根据用户类型发送不同消息
        if self.is_group:
            await self.send_text(f"群聊消息 - 当前群成员: @{self.user_nickname}")
        else:
            await self.send_text(f"私聊消息 - 你好 {self.user_nickname}！")
        
        # 根据时间发送不同表情
        from datetime import datetime
        hour = datetime.now().hour
        
        if 6 <= hour < 12:
            await self.send_emoji("🌅")  # 早上
        elif 12 <= hour < 18:
            await self.send_emoji("☀️")  # 下午
        else:
            await self.send_emoji("🌙")  # 晚上
        
        return True, "发送了条件化消息"
```

## 🛠️ 高级消息发送功能

### 批量消息发送

```python
class BatchMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        messages = [
            ("text", "第一条消息"),
            ("emoji", "🎉"),
            ("text", "第二条消息"),
            ("emoji", "✨")
        ]
        
        for msg_type, content in messages:
            if msg_type == "text":
                await self.send_text(content)
            elif msg_type == "emoji":
                await self.send_emoji(content)
            
            # 可选：添加延迟避免消息发送过快
            import asyncio
            await asyncio.sleep(0.5)
        
        return True, "发送了批量消息"
```

### 错误处理和重试

```python
class ReliableMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                await self.send_text("重要消息")
                return True, "消息发送成功"
            except Exception as e:
                retry_count += 1
                logger.warning(f"消息发送失败 (尝试 {retry_count}/{max_retries}): {e}")
                
                if retry_count < max_retries:
                    import asyncio
                    await asyncio.sleep(1)  # 等待1秒后重试
        
        return False, "消息发送失败，已达到最大重试次数"
```

## 📝 最佳实践

### 1. 消息发送最佳实践

```python
# ✅ 好的做法
class GoodMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 1. 检查配置
        if not self.get_config("features.enable_messages", True):
            return True, "消息功能已禁用"
        
        # 2. 简洁的消息发送
        await self.send_text("简洁明了的消息")
        
        # 3. 适当的表情使用
        if self.get_config("features.enable_emoji", True):
            await self.send_emoji("😊")
        
        return True, "消息发送完成"

# ❌ 避免的做法
class BadMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 避免：过长的消息
        await self.send_text("这是一条非常非常长的消息" * 50)
        
        # 避免：过多的表情
        for emoji in ["😊", "🎉", "✨", "🌟", "💫"]:
            await self.send_emoji(emoji)
        
        return True, "发送了糟糕的消息"
```

### 2. 错误处理

```python
# ✅ 推荐的错误处理
class SafeMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        try:
            message = self.get_config("messages.default", "默认消息")
            await self.send_text(message)
            return True, "消息发送成功"
        except Exception as e:
            logger.error(f"消息发送失败: {e}")
            # 可选：发送备用消息
            await self.send_text("消息发送遇到问题，请稍后再试")
            return False, f"发送失败: {str(e)}"
```

### 3. 性能优化

```python
# ✅ 性能友好的消息发送
class OptimizedMessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 合并多个短消息为一条长消息
        parts = [
            "第一部分信息",
            "第二部分信息", 
            "第三部分信息"
        ]
        
        combined_message = "\n".join(parts)
        await self.send_text(combined_message)
        
        return True, "发送了优化的消息"
```

通过新的API格式，消息发送变得更加简洁高效！ 