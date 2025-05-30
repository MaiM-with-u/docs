# 如何编写MaiBot插件

## 基本步骤

1. 在`src/plugins/你的插件名/actions/`目录下创建插件文件
2. 继承`PluginAction`基类
3. 实现`process`方法

## 插件结构示例

```python
from src.common.logger_manager import get_logger
from src.chat.focus_chat.planners.actions.plugin_action import PluginAction, register_action
from typing import Tuple

logger = get_logger("your_action_name")

@register_action
class YourAction(PluginAction):
    """你的动作描述"""

    action_name = "your_action_name"  # 动作名称，必须唯一
    action_description = "这个动作的详细描述，会展示给用户"
    action_parameters = {
        "param1": "参数1的说明（可选）",
        "param2": "参数2的说明（可选）"
    }
    action_require = [
        "使用场景1",
        "使用场景2"
    ]
    default = False  # 是否默认启用

    async def process(self) -> Tuple[bool, str]:
        """插件核心逻辑"""
        # 你的代码逻辑...
        return True, "执行结果"
```

## 可用的API方法

插件可以使用`PluginAction`基类提供的以下API：

### 1. 发送消息

```python
await self.send_message("要发送的文本", target="可选的回复目标")
```

### 2. 获取聊天类型

```python
chat_type = self.get_chat_type()  # 返回 "group" 或 "private" 或 "unknown"
```

### 3. 获取最近消息

```python
messages = self.get_recent_messages(count=5)  # 获取最近5条消息
# 返回格式: [{"sender": "发送者", "content": "内容", "timestamp": 时间戳}, ...]
```

### 4. 获取动作参数

```python
param_value = self.action_data.get("param_name", "默认值")
```

### 5. 日志记录

```python
logger.info(f"{self.log_prefix} 你的日志信息")
logger.warning("警告信息")
logger.error("错误信息")
```

## 返回值说明

`process`方法必须返回一个元组，包含两个元素：

- 第一个元素(bool): 表示动作是否执行成功
- 第二个元素(str): 执行结果的文本描述

```python
return True, "执行成功的消息"
# 或
return False, "执行失败的原因"
```

## 最佳实践

1. 使用`action_parameters`清晰定义你的动作需要的参数
2. 使用`action_require`描述何时应该使用你的动作
3. 使用`action_description`准确描述你的动作功能
4. 使用`logger`记录重要信息，方便调试
5. 避免操作底层系统，尽量使用`PluginAction`提供的API

## 注册与加载

插件会在系统启动时自动加载，只要放在正确的目录并添加了`@register_action`装饰器。

若设置`default = True`，插件会自动添加到默认动作集；否则需要在系统中手动启用。