# 消息API

> 消息API提供了强大的消息查询、计数和格式化功能，让你轻松处理聊天消息数据。

## 导入方式

```python
from src.plugin_system.apis import message_api
```

## 功能概述

消息API主要提供三大类功能：
- **消息查询** - 按时间、聊天、用户等条件查询消息
- **消息计数** - 统计新消息数量
- **消息格式化** - 将消息转换为可读格式

---

## 消息查询API

### 按时间查询消息

#### `get_messages_by_time(start_time, end_time, limit=0, limit_mode="latest")`

获取指定时间范围内的消息

**参数：**
- `start_time` (float): 开始时间戳
- `end_time` (float): 结束时间戳  
- `limit` (int): 限制返回消息数量，0为不限制
- `limit_mode` (str): 限制模式，`"earliest"`获取最早记录，`"latest"`获取最新记录

**返回：** `List[Dict[str, Any]]` - 消息列表

**示例：**
```python
import time

# 获取最近24小时的消息
now = time.time()
yesterday = now - 24 * 3600
messages = message_api.get_messages_by_time(yesterday, now, limit=50)
```

### 按聊天查询消息

#### `get_messages_by_time_in_chat(chat_id, start_time, end_time, limit=0, limit_mode="latest")`

获取指定聊天中指定时间范围内的消息

**参数：**
- `chat_id` (str): 聊天ID
- 其他参数同上

**示例：**
```python
# 获取某个群聊最近的100条消息
messages = message_api.get_messages_by_time_in_chat(
    chat_id="123456789", 
    start_time=yesterday, 
    end_time=now, 
    limit=100
)
```

#### `get_messages_by_time_in_chat_inclusive(chat_id, start_time, end_time, limit=0, limit_mode="latest")`

获取指定聊天中指定时间范围内的消息（包含边界时间点）

与 `get_messages_by_time_in_chat` 类似，但包含边界时间戳的消息。

#### `get_recent_messages(chat_id, hours=24.0, limit=100, limit_mode="latest")`

获取指定聊天中最近一段时间的消息（便捷方法）

**参数：**
- `chat_id` (str): 聊天ID
- `hours` (float): 最近多少小时，默认24小时
- `limit` (int): 限制返回消息数量，默认100条
- `limit_mode` (str): 限制模式

**示例：**
```python
# 获取最近6小时的消息
recent_messages = message_api.get_recent_messages(
    chat_id="123456789", 
    hours=6.0, 
    limit=50
)
```

### 按用户查询消息

#### `get_messages_by_time_in_chat_for_users(chat_id, start_time, end_time, person_ids, limit=0, limit_mode="latest")`

获取指定聊天中指定用户在指定时间范围内的消息

**参数：**
- `chat_id` (str): 聊天ID
- `start_time` (float): 开始时间戳
- `end_time` (float): 结束时间戳
- `person_ids` (list): 用户ID列表
- `limit` (int): 限制返回消息数量
- `limit_mode` (str): 限制模式

**示例：**
```python
# 获取特定用户的消息
user_messages = message_api.get_messages_by_time_in_chat_for_users(
    chat_id="123456789",
    start_time=yesterday,
    end_time=now,
    person_ids=["user1", "user2"]
)
```

#### `get_messages_by_time_for_users(start_time, end_time, person_ids, limit=0, limit_mode="latest")`

获取指定用户在所有聊天中指定时间范围内的消息

### 其他查询方法

#### `get_random_chat_messages(start_time, end_time, limit=0, limit_mode="latest")`

随机选择一个聊天，返回该聊天在指定时间范围内的消息

#### `get_messages_before_time(timestamp, limit=0)`

获取指定时间戳之前的消息

#### `get_messages_before_time_in_chat(chat_id, timestamp, limit=0)`

获取指定聊天中指定时间戳之前的消息

#### `get_messages_before_time_for_users(timestamp, person_ids, limit=0)`

获取指定用户在指定时间戳之前的消息

---

## 消息计数API

### `count_new_messages(chat_id, start_time=0.0, end_time=None)`

计算指定聊天中从开始时间到结束时间的新消息数量

**参数：**
- `chat_id` (str): 聊天ID
- `start_time` (float): 开始时间戳
- `end_time` (float): 结束时间戳，如果为None则使用当前时间

**返回：** `int` - 新消息数量

**示例：**
```python
# 计算最近1小时的新消息数
import time
now = time.time()
hour_ago = now - 3600
new_count = message_api.count_new_messages("123456789", hour_ago, now)
print(f"最近1小时有{new_count}条新消息")
```

### `count_new_messages_for_users(chat_id, start_time, end_time, person_ids)`

计算指定聊天中指定用户从开始时间到结束时间的新消息数量

---

## 消息格式化API

### `build_readable_messages_to_str(messages, **options)`

将消息列表构建成可读的字符串

**参数：**
- `messages` (List[Dict[str, Any]]): 消息列表
- `replace_bot_name` (bool): 是否将机器人的名称替换为"你"，默认True
- `merge_messages` (bool): 是否合并连续消息，默认False
- `timestamp_mode` (str): 时间戳显示模式，`"relative"`或`"absolute"`，默认`"relative"`
- `read_mark` (float): 已读标记时间戳，用于分割已读和未读消息，默认0.0
- `truncate` (bool): 是否截断长消息，默认False
- `show_actions` (bool): 是否显示动作记录，默认False

**返回：** `str` - 格式化后的可读字符串

**示例：**
```python
# 获取消息并格式化为可读文本
messages = message_api.get_recent_messages("123456789", hours=2)
readable_text = message_api.build_readable_messages_to_str(
    messages,
    replace_bot_name=True,
    merge_messages=True,
    timestamp_mode="relative"
)
print(readable_text)
```

### `build_readable_messages_with_details(messages, **options)` 异步

将消息列表构建成可读的字符串，并返回详细信息

**参数：** 与 `build_readable_messages_to_str` 类似，但不包含 `read_mark` 和 `show_actions`

**返回：** `Tuple[str, List[Tuple[float, str, str]]]` - 格式化字符串和详细信息元组列表(时间戳, 昵称, 内容)

**示例：**
```python
# 异步获取详细格式化信息
readable_text, details = await message_api.build_readable_messages_with_details(
    messages,
    timestamp_mode="absolute"
)

for timestamp, nickname, content in details:
    print(f"{timestamp}: {nickname} 说: {content}")
```

### `get_person_ids_from_messages(messages)` 异步

从消息列表中提取不重复的用户ID列表

**参数：**
- `messages` (List[Dict[str, Any]]): 消息列表

**返回：** `List[str]` - 用户ID列表

**示例：**
```python
# 获取参与对话的所有用户ID
messages = message_api.get_recent_messages("123456789")
person_ids = await message_api.get_person_ids_from_messages(messages)
print(f"参与对话的用户: {person_ids}")
```

---

## 完整使用示例

### 场景1：统计活跃度

```python
import time
from src.plugin_system.apis import message_api

async def analyze_chat_activity(chat_id: str):
    """分析聊天活跃度"""
    now = time.time()
    day_ago = now - 24 * 3600
    
    # 获取最近24小时的消息
    messages = message_api.get_recent_messages(chat_id, hours=24)
    
    # 统计消息数量
    total_count = len(messages)
    
    # 获取参与用户
    person_ids = await message_api.get_person_ids_from_messages(messages)
    
    # 格式化消息内容
    readable_text = message_api.build_readable_messages_to_str(
        messages[-10:],  # 最后10条消息
        merge_messages=True,
        timestamp_mode="relative"
    )
    
    return {
        "total_messages": total_count,
        "active_users": len(person_ids),
        "recent_chat": readable_text
    }
```

### 场景2：查看特定用户的历史消息

```python
def get_user_history(chat_id: str, user_id: str, days: int = 7):
    """获取用户最近N天的消息历史"""
    now = time.time()
    start_time = now - days * 24 * 3600
    
    # 获取特定用户的消息
    user_messages = message_api.get_messages_by_time_in_chat_for_users(
        chat_id=chat_id,
        start_time=start_time,
        end_time=now,
        person_ids=[user_id],
        limit=100
    )
    
    # 格式化为可读文本
    readable_history = message_api.build_readable_messages_to_str(
        user_messages,
        replace_bot_name=False,
        timestamp_mode="absolute"
    )
    
    return readable_history
```

---

## 注意事项

1. **时间戳格式**：所有时间参数都使用Unix时间戳（float类型）
2. **异步函数**：`build_readable_messages_with_details` 和 `get_person_ids_from_messages` 是异步函数，需要使用 `await`
3. **性能考虑**：查询大量消息时建议设置合理的 `limit` 参数
4. **消息格式**：返回的消息是字典格式，包含时间戳、发送者、内容等信息
5. **用户ID**：`person_ids` 参数接受字符串列表，用于筛选特定用户的消息 