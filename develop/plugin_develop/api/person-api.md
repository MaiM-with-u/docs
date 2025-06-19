# 个人信息API

个人信息API模块提供用户信息查询和管理功能，让插件能够获取和使用用户的相关信息。

## 导入方式

```python
from src.plugin_system.apis import person_api
```

## 主要功能

### 1. Person ID管理

#### `get_person_id(platform: str, user_id: int) -> str`
根据平台和用户ID获取person_id

**参数：**
- `platform`：平台名称，如 "qq", "telegram" 等
- `user_id`：用户ID

**返回：**
- `str`：唯一的person_id（MD5哈希值）

**示例：**
```python
person_id = person_api.get_person_id("qq", 123456)
print(f"Person ID: {person_id}")
```

### 2. 用户信息查询

#### `get_person_value(person_id: str, field_name: str, default: Any = None) -> Any`
根据person_id和字段名获取某个值

**参数：**
- `person_id`：用户的唯一标识ID
- `field_name`：要获取的字段名，如 "nickname", "impression" 等
- `default`：当字段不存在或获取失败时返回的默认值

**返回：**
- `Any`：字段值或默认值

**示例：**
```python
nickname = await person_api.get_person_value(person_id, "nickname", "未知用户")
impression = await person_api.get_person_value(person_id, "impression")
```

#### `get_person_values(person_id: str, field_names: list, default_dict: dict = None) -> dict`
批量获取用户信息字段值

**参数：**
- `person_id`：用户的唯一标识ID
- `field_names`：要获取的字段名列表
- `default_dict`：默认值字典，键为字段名，值为默认值

**返回：**
- `dict`：字段名到值的映射字典

**示例：**
```python
values = await person_api.get_person_values(
    person_id,
    ["nickname", "impression", "know_times"],
    {"nickname": "未知用户", "know_times": 0}
)
```

### 3. 用户状态查询

#### `is_person_known(platform: str, user_id: int) -> bool`
判断是否认识某个用户

**参数：**
- `platform`：平台名称
- `user_id`：用户ID

**返回：**
- `bool`：是否认识该用户

**示例：**
```python
known = await person_api.is_person_known("qq", 123456)
if known:
    print("这个用户我认识")
```

### 4. 用户名查询

#### `get_person_id_by_name(person_name: str) -> str`
根据用户名获取person_id

**参数：**
- `person_name`：用户名

**返回：**
- `str`：person_id，如果未找到返回空字符串

**示例：**
```python
person_id = person_api.get_person_id_by_name("张三")
if person_id:
    print(f"找到用户: {person_id}")
```

## 使用示例

### 1. 基础用户信息获取

```python
from src.plugin_system.apis import person_api

async def get_user_info(platform: str, user_id: int):
    """获取用户基本信息"""
    
    # 获取person_id
    person_id = person_api.get_person_id(platform, user_id)
    
    # 获取用户信息
    user_info = await person_api.get_person_values(
        person_id,
        ["nickname", "impression", "know_times", "last_seen"],
        {
            "nickname": "未知用户",
            "impression": "",
            "know_times": 0,
            "last_seen": 0
        }
    )
    
    return {
        "person_id": person_id,
        "nickname": user_info["nickname"],
        "impression": user_info["impression"],
        "know_times": user_info["know_times"],
        "last_seen": user_info["last_seen"]
    }
```

### 2. 在Action中使用用户信息

```python
from src.plugin_system.base import BaseAction

class PersonalizedAction(BaseAction):
    async def execute(self, action_data, chat_stream):
        # 获取发送者信息
        user_id = chat_stream.user_info.user_id
        platform = chat_stream.platform
        
        # 获取person_id
        person_id = person_api.get_person_id(platform, user_id)
        
        # 获取用户昵称和印象
        nickname = await person_api.get_person_value(person_id, "nickname", "朋友")
        impression = await person_api.get_person_value(person_id, "impression", "")
        
        # 根据用户信息个性化回复
        if impression:
            response = f"你好 {nickname}！根据我对你的了解：{impression}"
        else:
            response = f"你好 {nickname}！很高兴见到你。"
        
        return {
            "success": True,
            "response": response,
            "user_info": {
                "nickname": nickname,
                "impression": impression
            }
        }
```

### 3. 用户识别和欢迎

```python
async def welcome_user(chat_stream):
    """欢迎用户，区分新老用户"""
    
    user_id = chat_stream.user_info.user_id
    platform = chat_stream.platform
    
    # 检查是否认识这个用户
    is_known = await person_api.is_person_known(platform, user_id)
    
    if is_known:
        # 老用户，获取详细信息
        person_id = person_api.get_person_id(platform, user_id)
        nickname = await person_api.get_person_value(person_id, "nickname", "老朋友")
        know_times = await person_api.get_person_value(person_id, "know_times", 0)
        
        welcome_msg = f"欢迎回来，{nickname}！我们已经聊过 {know_times} 次了。"
    else:
        # 新用户
        welcome_msg = "你好！很高兴认识你，我是MaiBot。"
    
    return welcome_msg
```

### 4. 用户搜索功能

```python
async def find_user_by_name(name: str):
    """根据名字查找用户"""
    
    person_id = person_api.get_person_id_by_name(name)
    
    if not person_id:
        return {"found": False, "message": f"未找到名为 '{name}' 的用户"}
    
    # 获取用户详细信息
    user_info = await person_api.get_person_values(
        person_id,
        ["nickname", "platform", "user_id", "impression", "know_times"],
        {}
    )
    
    return {
        "found": True,
        "person_id": person_id,
        "info": user_info
    }
```

### 5. 用户印象分析

```python
async def analyze_user_relationship(chat_stream):
    """分析用户关系"""
    
    user_id = chat_stream.user_info.user_id
    platform = chat_stream.platform
    person_id = person_api.get_person_id(platform, user_id)
    
    # 获取关系相关信息
    relationship_info = await person_api.get_person_values(
        person_id,
        ["nickname", "impression", "know_times", "relationship_level", "last_interaction"],
        {
            "nickname": "未知",
            "impression": "",
            "know_times": 0,
            "relationship_level": "stranger",
            "last_interaction": 0
        }
    )
    
    # 分析关系程度
    know_times = relationship_info["know_times"]
    if know_times == 0:
        relationship = "陌生人"
    elif know_times < 5:
        relationship = "新朋友"
    elif know_times < 20:
        relationship = "熟人"
    else:
        relationship = "老朋友"
    
    return {
        "nickname": relationship_info["nickname"],
        "relationship": relationship,
        "impression": relationship_info["impression"],
        "interaction_count": know_times
    }
```

## 常用字段说明

### 基础信息字段
- `nickname`：用户昵称
- `platform`：平台信息
- `user_id`：用户ID

### 关系信息字段
- `impression`：对用户的印象
- `know_times`：交互次数
- `relationship_level`：关系等级
- `last_seen`：最后见面时间
- `last_interaction`：最后交互时间

### 个性化字段
- `preferences`：用户偏好
- `interests`：兴趣爱好
- `mood_history`：情绪历史
- `topic_interests`：话题兴趣

## 最佳实践

### 1. 错误处理
```python
async def safe_get_user_info(person_id: str, field: str):
    """安全获取用户信息"""
    try:
        value = await person_api.get_person_value(person_id, field)
        return value if value is not None else "未设置"
    except Exception as e:
        logger.error(f"获取用户信息失败: {e}")
        return "获取失败"
```

### 2. 批量操作
```python
async def get_complete_user_profile(person_id: str):
    """获取完整用户档案"""
    
    # 一次性获取所有需要的字段
    fields = [
        "nickname", "impression", "know_times", 
        "preferences", "interests", "relationship_level"
    ]
    
    defaults = {
        "nickname": "用户",
        "impression": "",
        "know_times": 0,
        "preferences": "{}",
        "interests": "[]",
        "relationship_level": "stranger"
    }
    
    profile = await person_api.get_person_values(person_id, fields, defaults)
    
    # 处理JSON字段
    try:
        profile["preferences"] = json.loads(profile["preferences"])
        profile["interests"] = json.loads(profile["interests"])
    except:
        profile["preferences"] = {}
        profile["interests"] = []
    
    return profile
```

## 注意事项

1. **异步操作**：大部分查询函数都是异步的，需要使用`await`
2. **错误处理**：所有函数都有错误处理，失败时记录日志并返回默认值
3. **数据类型**：返回的数据可能是字符串、数字或JSON，需要适当处理
4. **性能考虑**：批量查询优于单个查询
5. **隐私保护**：确保用户信息的使用符合隐私政策
6. **数据一致性**：person_id是用户的唯一标识，应妥善保存和使用 