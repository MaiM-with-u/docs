# MaiBot插件开发指南

## 概述

MaiBot插件系统（v0.2）通过**动作(Action)**的形式扩展功能，支持Focus和Normal两种聊天模式下的动作扩展。插件系统采用双激活类型机制，在不同模式下使用不同的激活策略，平衡智能性与性能。

### 核心特性

- **双激活类型系统**：Focus模式智能化，Normal模式高性能
- **并行动作支持**：Normal模式支持与回复同时执行的动作
- **四种激活类型**：ALWAYS、RANDOM、LLM_JUDGE、KEYWORD
- **模式启用控制**：精确控制插件在不同模式下的行为

## 文档索引

1. [快速入门](./quick_start.md) - 插件开发基础步骤和示例
2. [激活系统](./activation_system.md) - 动作激活机制详解
3. [插件结构示例](./plugin_examples.md) - 常见插件类型的代码示例
4. [配置模式推荐](./config_recommendations.md) - 推荐的配置模式和使用场景
5. [API参考](./api_reference.md) - 可用的API方法和使用说明
6. [迁移指南](./migration_guide.md) - 从v0.1迁移到v0.2的步骤
7. [最佳实践](./best_practices.md) - 代码组织、性能优化和用户体验

## 开发流程

1. 在`src/plugins/你的插件名/actions/`目录下创建插件文件
2. 继承`PluginAction`基类
3. 配置双激活类型和相关属性
4. 实现`process`方法
5. 在`src/plugins/你的插件名/__init__.py`中导入你的插件类

```python
# 基本插件结构
from src.chat.actions.plugin_action import PluginAction, register_action, ActionActivationType
from src.chat.chat_mode import ChatMode

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
        return True, "执行结果"
``` 