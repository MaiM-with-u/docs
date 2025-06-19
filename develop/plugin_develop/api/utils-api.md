# 工具API

工具API模块提供了各种辅助功能，包括文件操作、时间处理、唯一ID生成等常用工具函数。

## 导入方式

```python
from src.plugin_system.apis import utils_api
```

## 主要功能

### 1. 文件操作

#### `get_plugin_path(caller_frame=None) -> str`
获取调用者插件的路径

**参数：**
- `caller_frame`：调用者的栈帧，默认为None（自动获取）

**返回：**
- `str`：插件目录的绝对路径

**示例：**
```python
plugin_path = utils_api.get_plugin_path()
print(f"插件路径: {plugin_path}")
```

#### `read_json_file(file_path: str, default: Any = None) -> Any`
读取JSON文件

**参数：**
- `file_path`：文件路径，可以是相对于插件目录的路径
- `default`：如果文件不存在或读取失败时返回的默认值

**返回：**
- `Any`：JSON数据或默认值

**示例：**
```python
# 读取插件配置文件
config = utils_api.read_json_file("config.json", {})
settings = utils_api.read_json_file("data/settings.json", {"enabled": True})
```

#### `write_json_file(file_path: str, data: Any, indent: int = 2) -> bool`
写入JSON文件

**参数：**
- `file_path`：文件路径，可以是相对于插件目录的路径
- `data`：要写入的数据
- `indent`：JSON缩进

**返回：**
- `bool`：是否写入成功

**示例：**
```python
data = {"name": "test", "value": 123}
success = utils_api.write_json_file("output.json", data)
```

### 2. 时间相关

#### `get_timestamp() -> int`
获取当前时间戳

**返回：**
- `int`：当前时间戳（秒）

#### `format_time(timestamp: Optional[int] = None, format_str: str = "%Y-%m-%d %H:%M:%S") -> str`
格式化时间

**参数：**
- `timestamp`：时间戳，如果为None则使用当前时间
- `format_str`：时间格式字符串

**返回：**
- `str`：格式化后的时间字符串

#### `parse_time(time_str: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> int`
解析时间字符串为时间戳

**参数：**
- `time_str`：时间字符串
- `format_str`：时间格式字符串

**返回：**
- `int`：时间戳（秒）

### 3. 其他工具

#### `generate_unique_id() -> str`
生成唯一ID

**返回：**
- `str`：唯一ID

## 使用示例

### 1. 插件数据管理

```python
from src.plugin_system.apis import utils_api

class DataPlugin(BasePlugin):
    def __init__(self):
        self.plugin_path = utils_api.get_plugin_path()
        self.data_file = "plugin_data.json"
        self.load_data()
    
    def load_data(self):
        """加载插件数据"""
        default_data = {
            "users": {},
            "settings": {"enabled": True},
            "stats": {"message_count": 0}
        }
        self.data = utils_api.read_json_file(self.data_file, default_data)
    
    def save_data(self):
        """保存插件数据"""
        return utils_api.write_json_file(self.data_file, self.data)
    
    async def handle_action(self, action_data, chat_stream):
        # 更新统计信息
        self.data["stats"]["message_count"] += 1
        self.data["stats"]["last_update"] = utils_api.get_timestamp()
        
        # 保存数据
        if self.save_data():
            return {"success": True, "message": "数据已保存"}
        else:
            return {"success": False, "message": "数据保存失败"}
```

### 2. 日志记录系统

```python
class PluginLogger:
    def __init__(self, plugin_name: str):
        self.plugin_name = plugin_name
        self.log_file = f"{plugin_name}_log.json"
        self.logs = utils_api.read_json_file(self.log_file, [])
    
    def log_event(self, event_type: str, message: str, data: dict = None):
        """记录事件"""
        log_entry = {
            "id": utils_api.generate_unique_id(),
            "timestamp": utils_api.get_timestamp(),
            "formatted_time": utils_api.format_time(),
            "event_type": event_type,
            "message": message,
            "data": data or {}
        }
        
        self.logs.append(log_entry)
        
        # 保持最新的100条记录
        if len(self.logs) > 100:
            self.logs = self.logs[-100:]
        
        # 保存到文件
        utils_api.write_json_file(self.log_file, self.logs)
    
    def get_logs_by_type(self, event_type: str) -> list:
        """获取指定类型的日志"""
        return [log for log in self.logs if log["event_type"] == event_type]
    
    def get_recent_logs(self, count: int = 10) -> list:
        """获取最近的日志"""
        return self.logs[-count:]

# 使用示例
logger = PluginLogger("my_plugin")
logger.log_event("user_action", "用户发送了消息", {"user_id": "123", "message": "hello"})
```

### 3. 配置管理系统

```python
class ConfigManager:
    def __init__(self, config_file: str = "plugin_config.json"):
        self.config_file = config_file
        self.default_config = {
            "enabled": True,
            "debug": False,
            "max_users": 100,
            "response_delay": 1.0,
            "features": {
                "auto_reply": True,
                "logging": True
            }
        }
        self.config = self.load_config()
    
    def load_config(self) -> dict:
        """加载配置"""
        return utils_api.read_json_file(self.config_file, self.default_config)
    
    def save_config(self) -> bool:
        """保存配置"""
        return utils_api.write_json_file(self.config_file, self.config, indent=4)
    
    def get(self, key: str, default=None):
        """获取配置值，支持嵌套访问"""
        keys = key.split('.')
        value = self.config
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def set(self, key: str, value):
        """设置配置值，支持嵌套设置"""
        keys = key.split('.')
        config = self.config
        
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        
        config[keys[-1]] = value
    
    def update_config(self, updates: dict):
        """批量更新配置"""
        def deep_update(base, updates):
            for key, value in updates.items():
                if isinstance(value, dict) and key in base and isinstance(base[key], dict):
                    deep_update(base[key], value)
                else:
                    base[key] = value
        
        deep_update(self.config, updates)

# 使用示例
config = ConfigManager()
print(f"调试模式: {config.get('debug', False)}")
print(f"自动回复: {config.get('features.auto_reply', True)}")

config.set('features.new_feature', True)
config.save_config()
```

### 4. 缓存系统

```python
class PluginCache:
    def __init__(self, cache_file: str = "plugin_cache.json", ttl: int = 3600):
        self.cache_file = cache_file
        self.ttl = ttl  # 缓存过期时间（秒）
        self.cache = self.load_cache()
    
    def load_cache(self) -> dict:
        """加载缓存"""
        return utils_api.read_json_file(self.cache_file, {})
    
    def save_cache(self):
        """保存缓存"""
        return utils_api.write_json_file(self.cache_file, self.cache)
    
    def get(self, key: str):
        """获取缓存值"""
        if key not in self.cache:
            return None
        
        item = self.cache[key]
        current_time = utils_api.get_timestamp()
        
        # 检查是否过期
        if current_time - item["timestamp"] > self.ttl:
            del self.cache[key]
            return None
        
        return item["value"]
    
    def set(self, key: str, value):
        """设置缓存值"""
        self.cache[key] = {
            "value": value,
            "timestamp": utils_api.get_timestamp()
        }
        self.save_cache()
    
    def clear_expired(self):
        """清理过期缓存"""
        current_time = utils_api.get_timestamp()
        expired_keys = []
        
        for key, item in self.cache.items():
            if current_time - item["timestamp"] > self.ttl:
                expired_keys.append(key)
        
        for key in expired_keys:
            del self.cache[key]
        
        if expired_keys:
            self.save_cache()
        
        return len(expired_keys)

# 使用示例
cache = PluginCache(ttl=1800)  # 30分钟过期
cache.set("user_data_123", {"name": "张三", "score": 100})
user_data = cache.get("user_data_123")
```

### 5. 时间处理工具

```python
class TimeHelper:
    @staticmethod
    def get_time_info():
        """获取当前时间的详细信息"""
        timestamp = utils_api.get_timestamp()
        return {
            "timestamp": timestamp,
            "datetime": utils_api.format_time(timestamp),
            "date": utils_api.format_time(timestamp, "%Y-%m-%d"),
            "time": utils_api.format_time(timestamp, "%H:%M:%S"),
            "year": utils_api.format_time(timestamp, "%Y"),
            "month": utils_api.format_time(timestamp, "%m"),
            "day": utils_api.format_time(timestamp, "%d"),
            "weekday": utils_api.format_time(timestamp, "%A")
        }
    
    @staticmethod
    def time_ago(timestamp: int) -> str:
        """计算时间差"""
        current = utils_api.get_timestamp()
        diff = current - timestamp
        
        if diff < 60:
            return f"{diff}秒前"
        elif diff < 3600:
            return f"{diff // 60}分钟前"
        elif diff < 86400:
            return f"{diff // 3600}小时前"
        else:
            return f"{diff // 86400}天前"
    
    @staticmethod
    def parse_duration(duration_str: str) -> int:
        """解析时间段字符串，返回秒数"""
        import re
        
        pattern = r'(\d+)([smhd])'
        matches = re.findall(pattern, duration_str.lower())
        
        total_seconds = 0
        for value, unit in matches:
            value = int(value)
            if unit == 's':
                total_seconds += value
            elif unit == 'm':
                total_seconds += value * 60
            elif unit == 'h':
                total_seconds += value * 3600
            elif unit == 'd':
                total_seconds += value * 86400
        
        return total_seconds

# 使用示例
time_info = TimeHelper.get_time_info()
print(f"当前时间: {time_info['datetime']}")

last_seen = 1699000000
print(f"最后见面: {TimeHelper.time_ago(last_seen)}")

duration = TimeHelper.parse_duration("1h30m")  # 1小时30分钟 = 5400秒
```

## 最佳实践

### 1. 错误处理
```python
def safe_file_operation(file_path: str, data: dict):
    """安全的文件操作"""
    try:
        success = utils_api.write_json_file(file_path, data)
        if not success:
            logger.warning(f"文件写入失败: {file_path}")
        return success
    except Exception as e:
        logger.error(f"文件操作出错: {e}")
        return False
```

### 2. 路径处理
```python
import os

def get_data_path(filename: str) -> str:
    """获取数据文件的完整路径"""
    plugin_path = utils_api.get_plugin_path()
    data_dir = os.path.join(plugin_path, "data")
    
    # 确保数据目录存在
    os.makedirs(data_dir, exist_ok=True)
    
    return os.path.join(data_dir, filename)
```

### 3. 定期清理
```python
async def cleanup_old_files():
    """清理旧文件"""
    plugin_path = utils_api.get_plugin_path()
    current_time = utils_api.get_timestamp()
    
    for filename in os.listdir(plugin_path):
        if filename.endswith('.tmp'):
            file_path = os.path.join(plugin_path, filename)
            file_time = os.path.getmtime(file_path)
            
            # 删除超过24小时的临时文件
            if current_time - file_time > 86400:
                os.remove(file_path)
```

## 注意事项

1. **相对路径**：文件路径支持相对于插件目录的路径
2. **自动创建目录**：写入文件时会自动创建必要的目录
3. **错误处理**：所有函数都有错误处理，失败时返回默认值
4. **编码格式**：文件读写使用UTF-8编码
5. **时间格式**：时间戳使用秒为单位
6. **JSON格式**：JSON文件使用可读性好的缩进格式 