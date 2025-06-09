# 快速入门

## 前言

MaiBot插件系统目前为v0.2版本，支持Focus和Normal两种聊天模式下的动作扩展。插件以**动作(Action)**的形式扩展MaiBot功能，通过插件系统可以添加自定义动作如mute_action（禁言）、pic_action（绘图）、解析网页等。

## 基本步骤

1. 在`src/plugins/你的插件名/actions/`目录下创建插件文件
2. 继承`PluginAction`基类
3. 配置双激活类型和相关属性
4. 实现`process`方法
5. 在`src/plugins/你的插件名/__init__.py`中导入你的插件类

```python
# src/plugins/你的插件名/__init__.py
from .actions.your_action import YourAction

__all__ = ["YourAction"]
```

## 最简示例

```python
from src.common.logger_manager import get_logger
from src.chat.actions.plugin_action import PluginAction, register_action, ActionActivationType
from src.chat.chat_mode import ChatMode
from typing import Tuple

logger = get_logger("hello_action")

@register_action
class HelloAction(PluginAction):
    """简单的问候动作"""

    action_name = "hello_action"
    action_description = "当检测到问候关键词时回应问候"
    
    # 双激活类型配置
    focus_activation_type = ActionActivationType.KEYWORD
    normal_activation_type = ActionActivationType.KEYWORD
    activation_keywords = ["你好", "hello", "hi", "嗨"]
    keyword_case_sensitive = False
    
    # 模式和并行控制
    mode_enable = ChatMode.ALL
    parallel_action = False
    enable_plugin = True
    
    async def process(self) -> Tuple[bool, str]:
        """回应问候"""
        return True, "你好！很高兴见到你！"
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

## 注册与加载

插件会在系统启动时自动加载，只要：
1. 放在正确的目录结构中
2. 添加了`@register_action`装饰器
3. 在`__init__.py`中正确导入

若设置`default = True`，插件会自动添加到默认动作集并启用，否则默认只加载不启用。 