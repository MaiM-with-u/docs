# 聊天API

聊天API模块专门负责聊天信息的查询和管理，帮助插件获取和管理不同的聊天流。

## 导入方式

```python
from src.plugin_system.apis import chat_api
# 或者
from src.plugin_system.apis.chat_api import ChatManager as chat
```

## 主要功能

### 1. 获取聊天流

#### `get_all_streams(platform: str = "qq") -> List[ChatStream]`
获取所有聊天流

**参数：**
- `platform`：平台筛选，默认为"qq"

**返回：**
- `List[ChatStream]`：聊天流列表

**示例：**
```python
streams = chat_api.get_all_streams()
for stream in streams:
    print(f"聊天流ID: {stream.stream_id}")
```

#### `get_group_streams(platform: str = "qq") -> List[ChatStream]`
获取所有群聊聊天流

**参数：**
- `platform`：平台筛选，默认为"qq"

**返回：**
- `List[ChatStream]`：群聊聊天流列表

#### `get_private_streams(platform: str = "qq") -> List[ChatStream]`
获取所有私聊聊天流

**参数：**
- `platform`：平台筛选，默认为"qq"

**返回：**
- `List[ChatStream]`：私聊聊天流列表

### 2. 查找特定聊天流

#### `get_stream_by_group_id(group_id: str, platform: str = "qq") -> Optional[ChatStream]`
根据群ID获取聊天流

**参数：**
- `group_id`：群聊ID
- `platform`：平台，默认为"qq"

**返回：**
- `Optional[ChatStream]`：聊天流对象，如果未找到返回None

**示例：**
```python
chat_stream = chat_api.get_stream_by_group_id("123456789")
if chat_stream:
    print(f"找到群聊: {chat_stream.group_info.group_name}")
```

#### `get_stream_by_user_id(user_id: str, platform: str = "qq") -> Optional[ChatStream]`
根据用户ID获取私聊流

**参数：**
- `user_id`：用户ID
- `platform`：平台，默认为"qq"

**返回：**
- `Optional[ChatStream]`：聊天流对象，如果未找到返回None

### 3. 聊天流信息查询

#### `get_stream_type(chat_stream: ChatStream) -> str`
获取聊天流类型

**参数：**
- `chat_stream`：聊天流对象

**返回：**
- `str`：聊天类型 ("group", "private", "unknown")

#### `get_stream_info(chat_stream: ChatStream) -> Dict[str, Any]`
获取聊天流详细信息

**参数：**
- `chat_stream`：聊天流对象

**返回：**
- `Dict[str, Any]`：聊天流信息字典，包含stream_id、platform、type等信息

**示例：**
```python
info = chat_api.get_stream_info(chat_stream)
print(f"聊天类型: {info['type']}")
print(f"平台: {info['platform']}")
if info['type'] == 'group':
    print(f"群ID: {info['group_id']}")
    print(f"群名: {info['group_name']}")
```

#### `get_streams_summary() -> Dict[str, int]`
获取聊天流统计信息

**返回：**
- `Dict[str, int]`：包含各平台群聊和私聊数量的统计字典

## 使用示例

### 基础用法
```python
from src.plugin_system.apis import chat_api

# 获取所有群聊
group_streams = chat_api.get_group_streams()
print(f"共有 {len(group_streams)} 个群聊")

# 查找特定群聊
target_group = chat_api.get_stream_by_group_id("123456789")
if target_group:
    group_info = chat_api.get_stream_info(target_group)
    print(f"群名: {group_info['group_name']}")
```

### 遍历所有聊天流
```python
# 获取所有聊天流并分类处理
all_streams = chat_api.get_all_streams()

for stream in all_streams:
    stream_type = chat_api.get_stream_type(stream)
    if stream_type == "group":
        print(f"群聊: {stream.group_info.group_name}")
    elif stream_type == "private":
        print(f"私聊: {stream.user_info.user_nickname}")
```

## 注意事项

1. 所有函数都有错误处理，失败时会记录日志
2. 查询函数返回None或空列表时表示未找到结果
3. `platform`参数通常为"qq"，也可能支持其他平台
4. `ChatStream`对象包含了聊天的完整信息，包括用户信息、群信息等 