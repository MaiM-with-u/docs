# 回复生成器API

回复生成器API模块提供智能回复生成功能，让插件能够使用系统的回复生成器来产生自然的聊天回复。

## 导入方式

```python
from src.plugin_system.apis import generator_api
```

## 主要功能

### 1. 回复器获取

#### `get_replyer(chat_stream=None, platform=None, chat_id=None, is_group=True)`
获取回复器对象

**参数：**
- `chat_stream`：聊天流对象（优先）
- `platform`：平台名称，如"qq"
- `chat_id`：聊天ID（群ID或用户ID）
- `is_group`：是否为群聊

**返回：**
- `DefaultReplyer`：回复器对象，如果获取失败则返回None

**示例：**
```python
# 使用聊天流获取回复器
replyer = generator_api.get_replyer(chat_stream=chat_stream)

# 使用平台和ID获取回复器  
replyer = generator_api.get_replyer(
    platform="qq",
    chat_id="123456789",
    is_group=True
)
```

### 2. 回复生成

#### `generate_reply(chat_stream=None, action_data=None, platform=None, chat_id=None, is_group=True)`
生成回复

**参数：**
- `chat_stream`：聊天流对象（优先）
- `action_data`：动作数据
- `platform`：平台名称（备用）
- `chat_id`：聊天ID（备用）
- `is_group`：是否为群聊（备用）

**返回：**
- `Tuple[bool, List[Tuple[str, Any]]]`：(是否成功, 回复集合)

**示例：**
```python
success, reply_set = await generator_api.generate_reply(
    chat_stream=chat_stream,
    action_data={"message": "你好", "intent": "greeting"}
)

if success:
    for reply_type, reply_content in reply_set:
        print(f"回复类型: {reply_type}, 内容: {reply_content}")
```

#### `rewrite_reply(chat_stream=None, reply_data=None, platform=None, chat_id=None, is_group=True)`
重写回复

**参数：**
- `chat_stream`：聊天流对象（优先）
- `reply_data`：回复数据
- `platform`：平台名称（备用）
- `chat_id`：聊天ID（备用）
- `is_group`：是否为群聊（备用）

**返回：**
- `Tuple[bool, List[Tuple[str, Any]]]`：(是否成功, 回复集合)

**示例：**
```python
success, reply_set = await generator_api.rewrite_reply(
    chat_stream=chat_stream,
    reply_data={"original_text": "原始回复", "style": "more_friendly"}
)
```

## 使用示例

### 1. 基础回复生成

```python
from src.plugin_system.apis import generator_api

async def generate_greeting_reply(chat_stream, user_name):
    """生成问候回复"""
    
    action_data = {
        "intent": "greeting",
        "user_name": user_name,
        "context": "morning_greeting"
    }
    
    success, reply_set = await generator_api.generate_reply(
        chat_stream=chat_stream,
        action_data=action_data
    )
    
    if success and reply_set:
        # 获取第一个回复
        reply_type, reply_content = reply_set[0]
        return reply_content
    
    return "你好！"  # 默认回复
```

### 2. 在Action中使用回复生成器

```python
from src.plugin_system.base import BaseAction

class ChatAction(BaseAction):
    async def execute(self, action_data, chat_stream):
        # 准备回复数据
        reply_context = {
            "message_type": "response",
            "user_input": action_data.get("user_message", ""),
            "intent": action_data.get("intent", ""),
            "entities": action_data.get("entities", {}),
            "context": self.get_conversation_context(chat_stream)
        }
        
        # 生成回复
        success, reply_set = await generator_api.generate_reply(
            chat_stream=chat_stream,
            action_data=reply_context
        )
        
        if success:
            return {
                "success": True,
                "replies": reply_set,
                "generated_count": len(reply_set)
            }
        
        return {
            "success": False,
            "error": "回复生成失败",
            "fallback_reply": "抱歉，我现在无法理解您的消息。"
        }
```

### 3. 多样化回复生成

```python
async def generate_diverse_replies(chat_stream, topic, count=3):
    """生成多个不同风格的回复"""
    
    styles = ["formal", "casual", "humorous"]
    all_replies = []
    
    for i, style in enumerate(styles[:count]):
        action_data = {
            "topic": topic,
            "style": style,
            "variation": i
        }
        
        success, reply_set = await generator_api.generate_reply(
            chat_stream=chat_stream,
            action_data=action_data
        )
        
        if success and reply_set:
            all_replies.extend(reply_set)
    
    return all_replies
```

### 4. 回复重写功能

```python
async def improve_reply(chat_stream, original_reply, improvement_type="more_friendly"):
    """改进原始回复"""
    
    reply_data = {
        "original_text": original_reply,
        "improvement_type": improvement_type,
        "target_audience": "young_users",
        "tone": "positive"
    }
    
    success, improved_replies = await generator_api.rewrite_reply(
        chat_stream=chat_stream,
        reply_data=reply_data
    )
    
    if success and improved_replies:
        # 返回改进后的第一个回复
        _, improved_content = improved_replies[0]
        return improved_content
    
    return original_reply  # 如果改进失败，返回原始回复
```

### 5. 条件回复生成

```python
async def conditional_reply_generation(chat_stream, user_message, user_emotion):
    """根据用户情感生成条件回复"""
    
    # 根据情感调整回复策略
    if user_emotion == "sad":
        action_data = {
            "intent": "comfort",
            "tone": "empathetic",
            "style": "supportive"
        }
    elif user_emotion == "angry":
        action_data = {
            "intent": "calm",
            "tone": "peaceful",
            "style": "understanding"
        }
    else:
        action_data = {
            "intent": "respond",
            "tone": "neutral",
            "style": "helpful"
        }
    
    action_data["user_message"] = user_message
    action_data["user_emotion"] = user_emotion
    
    success, reply_set = await generator_api.generate_reply(
        chat_stream=chat_stream,
        action_data=action_data
    )
    
    return reply_set if success else []
```

## 回复集合格式

### 回复类型
生成的回复集合包含多种类型的回复：

- `"text"`：纯文本回复
- `"emoji"`：表情包回复
- `"image"`：图片回复
- `"mixed"`：混合类型回复

### 回复集合结构
```python
# 示例回复集合
reply_set = [
    ("text", "很高兴见到你！"),
    ("emoji", "emoji_base64_data"),
    ("text", "有什么可以帮助你的吗？")
]
```

## 高级用法

### 1. 自定义回复器配置

```python
async def generate_with_custom_config(chat_stream, action_data):
    """使用自定义配置生成回复"""
    
    # 获取回复器
    replyer = generator_api.get_replyer(chat_stream=chat_stream)
    
    if replyer:
        # 可以访问回复器的内部方法
        success, reply_set = await replyer.generate_reply_with_context(
            reply_data=action_data,
            # 可以传递额外的配置参数
        )
        return success, reply_set
    
    return False, []
```

### 2. 回复质量评估

```python
async def generate_and_evaluate_replies(chat_stream, action_data):
    """生成回复并评估质量"""
    
    success, reply_set = await generator_api.generate_reply(
        chat_stream=chat_stream,
        action_data=action_data
    )
    
    if success:
        evaluated_replies = []
        for reply_type, reply_content in reply_set:
            # 简单的质量评估
            quality_score = evaluate_reply_quality(reply_content)
            evaluated_replies.append({
                "type": reply_type,
                "content": reply_content,
                "quality": quality_score
            })
        
        # 按质量排序
        evaluated_replies.sort(key=lambda x: x["quality"], reverse=True)
        return evaluated_replies
    
    return []

def evaluate_reply_quality(reply_content):
    """简单的回复质量评估"""
    if not reply_content:
        return 0
    
    score = 50  # 基础分
    
    # 长度适中加分
    if 5 <= len(reply_content) <= 100:
        score += 20
    
    # 包含积极词汇加分
    positive_words = ["好", "棒", "不错", "感谢", "开心"]
    for word in positive_words:
        if word in reply_content:
            score += 10
            break
    
    return min(score, 100)
```

## 注意事项

1. **异步操作**：所有生成函数都是异步的，必须使用`await`
2. **错误处理**：函数内置错误处理，失败时返回False和空列表
3. **聊天流依赖**：需要有效的聊天流对象才能正常工作
4. **性能考虑**：回复生成可能需要一些时间，特别是使用LLM时
5. **回复格式**：返回的回复集合是元组列表，包含类型和内容
6. **上下文感知**：生成器会考虑聊天上下文和历史消息 