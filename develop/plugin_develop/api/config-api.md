# 配置API

配置API模块提供了配置读取和用户信息获取等功能，让插件能够安全地访问全局配置和用户信息。

## 导入方式

```python
from src.plugin_system.apis import config_api
```

## 主要功能

### 1. 配置访问

#### `get_global_config(key: str, default: Any = None) -> Any`
安全地从全局配置中获取一个值

**参数：**
- `key`：配置键名，支持嵌套访问如 "section.subsection.key"
- `default`：如果配置不存在时返回的默认值

**返回：**
- `Any`：配置值或默认值

**示例：**
```python
# 获取机器人昵称
bot_name = config_api.get_global_config("bot.nickname", "MaiBot")

# 获取嵌套配置
llm_model = config_api.get_global_config("model.default.model_name", "gpt-3.5-turbo")

# 获取不存在的配置
unknown_config = config_api.get_global_config("unknown.config", "默认值")
```

#### `get_plugin_config(plugin_config: dict, key: str, default: Any = None) -> Any`
从插件配置中获取值，支持嵌套键访问

**参数：**
- `plugin_config`：插件配置字典
- `key`：配置键名，支持嵌套访问如 "section.subsection.key"
- `default`：如果配置不存在时返回的默认值

**返回：**
- `Any`：配置值或默认值

**示例：**
```python
# 在插件中使用
class MyPlugin(BasePlugin):
    async def handle_action(self, action_data, chat_stream):
        # 获取插件配置
        api_key = config_api.get_plugin_config(self.config, "api.key", "")
        timeout = config_api.get_plugin_config(self.config, "timeout", 30)
        
        if not api_key:
            logger.warning("API密钥未配置")
            return False
```

### 2. 用户信息API

#### `get_user_id_by_person_name(person_name: str) -> tuple[str, str]`
根据用户名获取用户ID

**参数：**
- `person_name`：用户名

**返回：**
- `tuple[str, str]`：(平台, 用户ID)

**示例：**
```python
platform, user_id = await config_api.get_user_id_by_person_name("张三")
if platform and user_id:
    print(f"用户张三在{platform}平台的ID是{user_id}")
```

#### `get_person_info(person_id: str, key: str, default: Any = None) -> Any`
获取用户信息

**参数：**
- `person_id`：用户ID
- `key`：信息键名
- `default`：默认值

**返回：**
- `Any`：用户信息值或默认值

**示例：**
```python
# 获取用户昵称
nickname = await config_api.get_person_info(person_id, "nickname", "未知用户")

# 获取用户印象
impression = await config_api.get_person_info(person_id, "impression", "")
```

## 使用示例

### 配置驱动的插件开发
```python
from src.plugin_system.apis import config_api
from src.plugin_system.base import BasePlugin

class WeatherPlugin(BasePlugin):
    async def handle_action(self, action_data, chat_stream):
        # 从全局配置获取API配置
        api_endpoint = config_api.get_global_config("weather.api_endpoint", "")
        default_city = config_api.get_global_config("weather.default_city", "北京")
        
        # 从插件配置获取特定设置
        api_key = config_api.get_plugin_config(self.config, "api_key", "")
        timeout = config_api.get_plugin_config(self.config, "timeout", 10)
        
        if not api_key:
            return {"success": False, "message": "Weather API密钥未配置"}
        
        # 使用配置进行天气查询...
        return {"success": True, "message": f"{default_city}今天天气晴朗"}
```

### 用户信息查询
```python
async def get_user_by_name(user_name: str):
    """根据用户名获取完整的用户信息"""
    
    # 获取用户的平台和ID
    platform, user_id = await config_api.get_user_id_by_person_name(user_name)
    
    if not platform or not user_id:
        return None
    
    # 构建person_id
    from src.person_info.person_info import PersonInfoManager
    person_id = PersonInfoManager.get_person_id(platform, user_id)
    
    # 获取用户详细信息
    nickname = await config_api.get_person_info(person_id, "nickname", user_name)
    impression = await config_api.get_person_info(person_id, "impression", "")
    
    return {
        "platform": platform,
        "user_id": user_id,
        "nickname": nickname,
        "impression": impression
    }
```

## 配置键名说明

### 常用全局配置键
- `bot.nickname`：机器人昵称
- `bot.qq_account`：机器人QQ号
- `model.default`：默认LLM模型配置
- `database.path`：数据库路径

### 嵌套配置访问
配置支持点号分隔的嵌套访问：
```python
# config.toml 中的配置：
# [bot]
# nickname = "MaiBot"
# qq_account = "123456"
# 
# [model.default]
# model_name = "gpt-3.5-turbo"
# temperature = 0.7

# API调用：
bot_name = config_api.get_global_config("bot.nickname")
model_name = config_api.get_global_config("model.default.model_name")
temperature = config_api.get_global_config("model.default.temperature")
```

## 注意事项

1. **只读访问**：配置API只提供读取功能，插件不能修改全局配置
2. **异步函数**：用户信息相关的函数是异步的，需要使用`await`
3. **错误处理**：所有函数都有错误处理，失败时会记录日志并返回默认值
4. **安全性**：插件通过此API访问配置是安全和隔离的
5. **性能**：频繁访问的配置建议在插件初始化时获取并缓存 