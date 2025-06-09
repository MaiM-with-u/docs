# MaiBot插件开发指南

## 概述

MaiBot插件系统（v0.2）提供了多种扩展机器人功能的方式，主要包括：

- **动作(Action)系统**：通过动作扩展功能，支持Focus和Normal两种聊天模式下的功能扩展
- **命令(Command)系统**：通过命令处理特定指令，在消息处理的早期阶段直接响应

插件系统采用双激活类型机制，在不同模式下使用不同的激活策略，平衡智能性与性能。

### 核心特性

- **双激活类型系统**：Focus模式智能化，Normal模式高性能
- **并行动作支持**：Normal模式支持与回复同时执行的动作
- **四种激活类型**：ALWAYS、RANDOM、LLM_JUDGE、KEYWORD
- **模式启用控制**：精确控制插件在不同模式下的行为
- **命令处理系统**：直接处理以"/"开头的特定命令
- **动作存储功能**：记录动作执行历史，支持上下文构建

## 文档索引

1. [快速入门](./quick_start.md) - 插件开发基础步骤和示例

### Actions系统
2. [激活系统](./activation_system.md) - 动作激活机制详解
3. [插件结构示例](./plugin_examples.md) - 常见插件类型的代码示例
4. [配置模式推荐](./config_recommendations.md) - 推荐的配置模式和使用场景

### 命令系统
5. [命令处理系统](./command_system.md) - 命令系统的实现和使用方法

### 迁移指南
6. [迁移指南](./migration_guide.md) - 从v0.1迁移到v0.2的步骤

### API
7. [API参考](./api_reference.md) - 可用的API方法、动作存储功能和使用说明

### 最佳实践
8. [最佳实践](./best_practices.md) - 代码组织、性能优化和用户体验

## 开发流程

### 开发动作(Action)

1. 在`src/plugins/你的插件名/actions/`目录下创建插件文件
2. 继承`PluginAction`基类
3. 配置双激活类型和相关属性
4. 实现`process`方法
5. 在`src/plugins/你的插件名/__init__.py`中导入你的插件类

```python
# 基本动作结构
from src.chat.actions.plugin_action import PluginAction, register_action, ActionActivationType
from src.chat.actions.base_action import ChatMode

@register_action
class YourAction(PluginAction):
    """你的动作描述"""
    action_name = "your_action_name"
    
    # 双激活类型配置
    focus_activation_type = ActionActivationType.LLM_JUDGE
    normal_activation_type = ActionActivationType.KEYWORD
    activation_keywords = ["关键词1", "关键词2"]
    
    # 模式和并行控制
    mode_enable = ChatMode.ALL
    parallel_action = False
    
    async def process(self):
        # 插件逻辑
        result = "执行结果"
        
        # 存储动作信息（可选）
        await self.store_action_info(
            action_build_into_prompt=False,
            action_prompt_display="执行了某项操作"
        )
        
        return True, result
```

### 开发命令(Command)

1. 在`src/plugins/你的插件名/commands/`目录下创建命令文件
2. 继承`BaseCommand`基类
3. 使用`@register_command`装饰器注册命令
4. 实现`execute`方法
5. 在`src/plugins/你的插件名/__init__.py`中导入你的命令类

```python
# 基本命令结构
from src.command.base_command import BaseCommand, register_command

@register_command(
    name="yourcommand",
    description="你的命令描述",
    usage="/yourcommand [参数]"
)
class YourCommand(BaseCommand):
    async def execute(self, chat_stream, args):
        # 命令处理逻辑
        await chat_stream.send_message("命令执行结果")
        return False  # 不继续处理消息
```

### 完整插件结构示例

一个完整的插件通常包含以下文件结构：

```
src/plugins/your_plugin/
├── __init__.py           # 导入和导出插件组件
├── actions/              # 动作相关文件
│   ├── __init__.py
│   └── your_action.py    # 动作实现
├── commands/             # 命令相关文件
│   ├── __init__.py
│   └── your_command.py   # 命令实现
└── utils/                # 工具函数和辅助类
    └── helpers.py
```

在`__init__.py`中导入和导出组件：

```python
# src/plugins/your_plugin/__init__.py
from .actions.your_action import YourAction
from .commands.your_command import YourCommand

__all__ = ["YourAction", "YourCommand"]
```

通过这种方式，你可以创建一个包含动作和命令的完整插件，扩展MaiBot的功能。 