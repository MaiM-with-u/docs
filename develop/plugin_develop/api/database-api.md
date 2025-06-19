# 数据库API

数据库API模块提供通用的数据库操作功能，支持查询、创建、更新和删除记录，采用Peewee ORM模型。

## 导入方式

```python
from src.plugin_system.apis import database_api
```

## 主要功能

### 1. 通用数据库查询

#### `db_query(model_class, query_type="get", filters=None, data=None, limit=None, order_by=None, single_result=False)`
执行数据库查询操作的通用接口

**参数：**
- `model_class`：Peewee模型类，如ActionRecords、Messages等
- `query_type`：查询类型，可选值: "get", "create", "update", "delete", "count"
- `filters`：过滤条件字典，键为字段名，值为要匹配的值
- `data`：用于创建或更新的数据字典
- `limit`：限制结果数量
- `order_by`：排序字段列表，使用字段名，前缀'-'表示降序
- `single_result`：是否只返回单个结果

**返回：**
根据查询类型返回不同的结果：
- "get"：返回查询结果列表或单个结果
- "create"：返回创建的记录
- "update"：返回受影响的行数
- "delete"：返回受影响的行数
- "count"：返回记录数量

### 2. 便捷查询函数

#### `db_save(model_class, data, key_field=None, key_value=None)`
保存数据到数据库（创建或更新）

**参数：**
- `model_class`：Peewee模型类
- `data`：要保存的数据字典
- `key_field`：用于查找现有记录的字段名
- `key_value`：用于查找现有记录的字段值

**返回：**
- `Dict[str, Any]`：保存后的记录数据，失败时返回None

#### `db_get(model_class, filters=None, order_by=None, limit=None)`
简化的查询函数

**参数：**
- `model_class`：Peewee模型类
- `filters`：过滤条件字典
- `order_by`：排序字段
- `limit`：限制结果数量

**返回：**
- `Union[List[Dict], Dict, None]`：查询结果

### 3. 专用函数

#### `store_action_info(...)`
存储动作信息的专用函数

## 使用示例

### 1. 基本查询操作

```python
from src.plugin_system.apis import database_api
from src.common.database.database_model import Messages, ActionRecords

# 查询最近10条消息
messages = await database_api.db_query(
    Messages,
    query_type="get",
    filters={"chat_id": chat_stream.stream_id},
    limit=10,
    order_by=["-time"]
)

# 查询单条记录
message = await database_api.db_query(
    Messages,
    query_type="get",
    filters={"message_id": "msg_123"},
    single_result=True
)
```

### 2. 创建记录

```python
# 创建新的动作记录
new_record = await database_api.db_query(
    ActionRecords,
    query_type="create",
    data={
        "action_id": "action_123",
        "time": time.time(),
        "action_name": "TestAction",
        "action_done": True
    }
)

print(f"创建了记录: {new_record['id']}")
```

### 3. 更新记录

```python
# 更新动作状态
updated_count = await database_api.db_query(
    ActionRecords,
    query_type="update",
    filters={"action_id": "action_123"},
    data={"action_done": True, "completion_time": time.time()}
)

print(f"更新了 {updated_count} 条记录")
```

### 4. 删除记录

```python
# 删除过期记录
deleted_count = await database_api.db_query(
    ActionRecords,
    query_type="delete",
    filters={"time__lt": time.time() - 86400}  # 删除24小时前的记录
)

print(f"删除了 {deleted_count} 条过期记录")
```

### 5. 统计查询

```python
# 统计消息数量
message_count = await database_api.db_query(
    Messages,
    query_type="count",
    filters={"chat_id": chat_stream.stream_id}
)

print(f"该聊天有 {message_count} 条消息")
```

### 6. 使用便捷函数

```python
# 使用db_save进行创建或更新
record = await database_api.db_save(
    ActionRecords,
    {
        "action_id": "action_123",
        "time": time.time(),
        "action_name": "TestAction",
        "action_done": True
    },
    key_field="action_id",
    key_value="action_123"
)

# 使用db_get进行简单查询
recent_messages = await database_api.db_get(
    Messages,
    filters={"chat_id": chat_stream.stream_id},
    order_by="-time",
    limit=5
)
```

## 高级用法

### 复杂查询示例

```python
# 查询特定用户在特定时间段的消息
user_messages = await database_api.db_query(
    Messages,
    query_type="get",
    filters={
        "user_id": "123456",
        "time__gte": start_time,  # 大于等于开始时间
        "time__lt": end_time      # 小于结束时间
    },
    order_by=["-time"],
    limit=50
)

# 批量处理
for message in user_messages:
    print(f"消息内容: {message['plain_text']}")
    print(f"发送时间: {message['time']}")
```

### 插件中的数据持久化

```python
from src.plugin_system.base import BasePlugin
from src.plugin_system.apis import database_api

class DataPlugin(BasePlugin):
    async def handle_action(self, action_data, chat_stream):
        # 保存插件数据
        plugin_data = {
            "plugin_name": self.plugin_name,
            "chat_id": chat_stream.stream_id,
            "data": json.dumps(action_data),
            "created_time": time.time()
        }
        
        # 使用自定义表模型（需要先定义）
        record = await database_api.db_save(
            PluginData,  # 假设的插件数据模型
            plugin_data,
            key_field="plugin_name",
            key_value=self.plugin_name
        )
        
        return {"success": True, "record_id": record["id"]}
```

## 数据模型

### 常用模型类
系统提供了以下常用的数据模型：

- `Messages`：消息记录
- `ActionRecords`：动作记录
- `UserInfo`：用户信息
- `GroupInfo`：群组信息

### 字段说明

#### Messages模型主要字段
- `message_id`：消息ID
- `chat_id`：聊天ID
- `user_id`：用户ID
- `plain_text`：纯文本内容
- `time`：时间戳

#### ActionRecords模型主要字段
- `action_id`：动作ID
- `action_name`：动作名称
- `action_done`：是否完成
- `time`：创建时间

## 注意事项

1. **异步操作**：所有数据库API都是异步的，必须使用`await`
2. **错误处理**：函数内置错误处理，失败时返回None或空列表
3. **数据类型**：返回的都是字典格式的数据，不是模型对象
4. **性能考虑**：使用`limit`参数避免查询大量数据
5. **过滤条件**：支持简单的等值过滤，复杂查询需要使用原生Peewee语法
6. **事务**：如需事务支持，建议直接使用Peewee的事务功能 