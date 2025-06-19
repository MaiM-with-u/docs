# 表情包API

表情包API模块提供表情包的获取、查询和管理功能，让插件能够智能地选择和使用表情包。

## 导入方式

```python
from src.plugin_system.apis import emoji_api
```

## 主要功能

### 1. 表情包获取

#### `get_by_description(description: str) -> Optional[Tuple[str, str, str]]`
根据场景描述选择表情包

**参数：**
- `description`：场景描述文本，例如"开心的大笑"、"轻微的讽刺"、"表示无奈和沮丧"等

**返回：**
- `Optional[Tuple[str, str, str]]`：(base64编码, 表情包描述, 匹配的场景) 或 None

**示例：**
```python
emoji_result = await emoji_api.get_by_description("开心的大笑")
if emoji_result:
    emoji_base64, description, matched_scene = emoji_result
    print(f"获取到表情包: {description}, 场景: {matched_scene}")
    # 可以将emoji_base64用于发送表情包
```

#### `get_random() -> Optional[Tuple[str, str, str]]`
随机获取表情包

**返回：**
- `Optional[Tuple[str, str, str]]`：(base64编码, 表情包描述, 随机场景) 或 None

**示例：**
```python
random_emoji = await emoji_api.get_random()
if random_emoji:
    emoji_base64, description, scene = random_emoji
    print(f"随机表情包: {description}")
```

#### `get_by_emotion(emotion: str) -> Optional[Tuple[str, str, str]]`
根据场景关键词获取表情包

**参数：**
- `emotion`：场景关键词，如"大笑"、"讽刺"、"无奈"等

**返回：**
- `Optional[Tuple[str, str, str]]`：(base64编码, 表情包描述, 匹配的场景) 或 None

**示例：**
```python
emoji_result = await emoji_api.get_by_emotion("讽刺")
if emoji_result:
    emoji_base64, description, scene = emoji_result
    # 发送讽刺表情包
```

### 2. 表情包信息查询

#### `get_count() -> int`
获取表情包数量

**返回：**
- `int`：当前可用的表情包数量

#### `get_info() -> dict`
获取表情包系统信息

**返回：**
- `dict`：包含表情包数量、最大数量等信息

**返回字典包含：**
- `current_count`：当前表情包数量
- `max_count`：最大表情包数量
- `available_emojis`：可用表情包数量

#### `get_emotions() -> list`
获取所有可用的场景关键词

**返回：**
- `list`：所有表情包的场景关键词列表（去重）

#### `get_descriptions() -> list`
获取所有表情包的描述列表

**返回：**
- `list`：所有表情包的描述文本列表

## 使用示例

### 1. 智能表情包选择

```python
from src.plugin_system.apis import emoji_api

async def send_emotion_response(message_text: str, chat_stream):
    """根据消息内容智能选择表情包回复"""
    
    # 分析消息场景
    if "哈哈" in message_text or "好笑" in message_text:
        emoji_result = await emoji_api.get_by_description("开心的大笑")
    elif "无语" in message_text or "算了" in message_text:
        emoji_result = await emoji_api.get_by_description("表示无奈和沮丧")
    elif "呵呵" in message_text or "是吗" in message_text:
        emoji_result = await emoji_api.get_by_description("轻微的讽刺")
    elif "生气" in message_text or "愤怒" in message_text:
        emoji_result = await emoji_api.get_by_description("愤怒和不满")
    else:
        # 随机选择一个表情包
        emoji_result = await emoji_api.get_random()
    
    if emoji_result:
        emoji_base64, description, scene = emoji_result
        # 使用send_api发送表情包
        from src.plugin_system.apis import send_api
        success = await send_api.emoji_to_group(emoji_base64, chat_stream.group_info.group_id)
        return success
    
    return False
```

### 2. 表情包管理功能

```python
async def show_emoji_stats():
    """显示表情包统计信息"""
    
    # 获取基本信息
    count = emoji_api.get_count()
    info = emoji_api.get_info()
    scenes = emoji_api.get_emotions()  # 实际返回的是场景关键词
    
    stats = f"""
📊 表情包统计信息：
- 总数量: {count}
- 可用数量: {info['available_emojis']}
- 最大容量: {info['max_count']}
- 支持场景: {len(scenes)}种

🎭 支持的场景关键词: {', '.join(scenes[:10])}{'...' if len(scenes) > 10 else ''}
    """
    
    return stats
```

### 3. 表情包测试功能

```python
async def test_emoji_system():
    """测试表情包系统的各种功能"""
    
    print("=== 表情包系统测试 ===")
    
    # 测试场景描述查找
    test_descriptions = ["开心的大笑", "轻微的讽刺", "表示无奈和沮丧", "愤怒和不满"]
    for desc in test_descriptions:
        result = await emoji_api.get_by_description(desc)
        if result:
            _, description, scene = result
            print(f"✅ 场景'{desc}' -> {description} ({scene})")
        else:
            print(f"❌ 场景'{desc}' -> 未找到")
    
    # 测试关键词查找
    scenes = emoji_api.get_emotions()
    if scenes:
        test_scene = scenes[0]
        result = await emoji_api.get_by_emotion(test_scene)
        if result:
            print(f"✅ 关键词'{test_scene}' -> 找到匹配表情包")
    
    # 测试随机获取
    random_result = await emoji_api.get_random()
    if random_result:
        print("✅ 随机获取 -> 成功")
    
    print(f"📊 系统信息: {emoji_api.get_info()}")
```

### 4. 在Action中使用表情包

```python
from src.plugin_system.base import BaseAction

class EmojiAction(BaseAction):
    async def execute(self, action_data, chat_stream):
        # 从action_data获取场景描述或关键词
        scene_keyword = action_data.get("scene", "")
        scene_description = action_data.get("description", "")
        
        emoji_result = None
        
        # 优先使用具体的场景描述
        if scene_description:
            emoji_result = await emoji_api.get_by_description(scene_description)
        # 其次使用场景关键词
        elif scene_keyword:
            emoji_result = await emoji_api.get_by_emotion(scene_keyword)
        # 最后随机选择
        else:
            emoji_result = await emoji_api.get_random()
        
        if emoji_result:
            emoji_base64, description, scene = emoji_result
            return {
                "success": True,
                "emoji_base64": emoji_base64,
                "description": description,
                "scene": scene
            }
        
        return {"success": False, "message": "未找到合适的表情包"}
```

## 场景描述说明

### 常用场景描述
表情包系统支持多种具体的场景描述，常见的包括：

- **开心类场景**：开心的大笑、满意的微笑、兴奋的手舞足蹈
- **无奈类场景**：表示无奈和沮丧、轻微的讽刺、无语的摇头
- **愤怒类场景**：愤怒和不满、生气的瞪视、暴躁的抓狂
- **惊讶类场景**：震惊的表情、意外的发现、困惑的思考
- **可爱类场景**：卖萌的表情、撒娇的动作、害羞的样子

### 场景关键词示例
系统支持的场景关键词包括：
- 大笑、微笑、兴奋、手舞足蹈
- 无奈、沮丧、讽刺、无语、摇头
- 愤怒、不满、生气、瞪视、抓狂
- 震惊、意外、困惑、思考
- 卖萌、撒娇、害羞、可爱

### 匹配机制
- **精确匹配**：优先匹配完整的场景描述，如"开心的大笑"
- **关键词匹配**：如果没有精确匹配，则根据关键词进行模糊匹配
- **语义匹配**：系统会理解场景的语义含义进行智能匹配

## 注意事项

1. **异步函数**：获取表情包的函数都是异步的，需要使用 `await`
2. **返回格式**：表情包以base64编码返回，可直接用于发送
3. **错误处理**：所有函数都有错误处理，失败时返回None或默认值
4. **使用统计**：系统会记录表情包的使用次数
5. **文件依赖**：表情包依赖于本地文件，确保表情包文件存在
6. **编码格式**：返回的是base64编码的图片数据，可直接用于网络传输
7. **场景理解**：系统能理解具体的场景描述，比简单的情感分类更准确
