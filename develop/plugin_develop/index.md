# 如何编写MaiBot插件

## 前言

目前插件系统为v0.1版本，仅试行并实现简单功能，且只能在focus下使用

目前插件的形式为给focus模型的决策增加新**动作action**

原有focus的planner有reply和no_reply两种动作

在麦麦plugin文件夹中的示例插件新增了mute_action动作和pic_action动作，你可以参考其中的代码

在**之后的更新**中，会兼容normal_chat aciton，更多的自定义组件，tool，和/help式指令

## 基本步骤

1. 在`src/plugins/你的插件名/actions/`目录下创建插件文件
2. 继承`PluginAction`基类
3. 实现`process`方法
4. 在`src/plugins/你的插件名/__init__.py`中导入你的插件类，确保插件能被正确加载

```python
# src/plugins/你的插件名/__init__.py
from .actions.your_action import YourAction

__all__ = ["YourAction"]
```

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

    associated_types = ["command", "text"] #该插件会发送的消息类型

    async def process(self) -> Tuple[bool, str]:
        """插件核心逻辑"""
        # 你的代码逻辑...
        return True, "执行结果"
```

## 可用的API方法

插件可以使用`PluginAction`基类提供的以下API：

### 1. 直接发送消息

```python
#发送文本
await self.send_message(type="text", data="你好")

#发送图片
await self.send_message(type="image", data=base64_image_string)

#发送命令（需要adapter支持）
await self.send_message(
    type="command",
    data={"name": "GROUP_BAN", "args": {"qq_id": str(user_id), "duration": duration_str}},
    display_message=f"我 禁言了 {target} {duration_str}秒",
)
```
会将消息直接以原始文本发送
type指定消息类型
data为发送内容

### 2. 使用表达器发送消息

```python
await self.send_message_by_expressor("你好")

await self.send_message_by_expressor(f"禁言{target} {duration}秒，因为{reason}")
```
将消息通过表达器发送，使用LLM组织成符合bot语言风格的内容并发送
只能发送文本

### 3. 获取聊天类型

```python
chat_type = self.get_chat_type()  # 返回 "group" 或 "private" 或 "unknown"
```

### 4. 获取最近消息

```python
messages = self.get_recent_messages(count=5)  # 获取最近5条消息
# 返回格式: [{"sender": "发送者", "content": "内容", "timestamp": 时间戳}, ...]
```

### 5. 获取动作参数

```python
param_value = self.action_data.get("param_name", "默认值")
```

### 6. 获取可用模型

```python
models = self.get_available_models()  # 返回所有可用的模型配置
# 返回格式: {"model_name": {"config": "value", ...}, ...}
```

### 7. 使用模型生成内容

```python
success, response, reasoning, model_name = await self.generate_with_model(
    prompt="你的提示词",
    model_config=models["model_name"],  # 从get_available_models获取的模型配置
    max_tokens=2000,  # 可选，最大生成token数
    request_type="plugin.generate",  # 可选，请求类型标识
    temperature=0.7,  # 可选，温度参数
    # 其他模型特定参数...
)
```

### 8. 获取用户ID

```python
platform, user_id = await self.get_user_id_by_person_name("用户名")
```

### 日志记录

```python
logger.info(f"{self.log_prefix} 你的日志信息")
logger.warning("警告信息")
logger.error("错误信息")
```

## 返回值说明

`process`方法必须返回一个元组，包含两个元素：

- 第一个元素(bool): 表示动作是否执行成功
- 第二个元素(str): 执行结果的文本描述（可以为空""）

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

若设置`default = True`，插件会自动添加到默认动作集并启用，否则默认只加载不启用。
