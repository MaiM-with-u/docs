# 插件结构示例

本文档提供了几种常见插件类型的完整代码示例，可以作为开发自己插件的参考。

## 智能自适应插件（推荐）

```python
from src.common.logger_manager import get_logger
from src.chat.actions.plugin_action import PluginAction, register_action, ActionActivationType
from src.chat.chat_mode import ChatMode
from typing import Tuple

logger = get_logger("your_action_name")

@register_action
class YourAction(PluginAction):
    """你的动作描述"""

    action_name = "your_action_name"
    action_description = "这个动作的详细描述，会展示给用户"
    
    # 双激活类型配置（智能自适应模式）
    focus_activation_type = ActionActivationType.LLM_JUDGE      # Focus模式使用智能判定
    normal_activation_type = ActionActivationType.KEYWORD       # Normal模式使用关键词
    activation_keywords = ["关键词1", "关键词2", "keyword"]
    keyword_case_sensitive = False
    
    # 模式和并行控制
    mode_enable = ChatMode.ALL      # 支持所有模式
    parallel_action = False         # 根据需要调整
    enable_plugin = True            # 是否启用插件
    
    # 传统配置
    action_parameters = {
        "param1": "参数1的说明（可选）",
        "param2": "参数2的说明（可选）"
    }
    action_require = [
        "使用场景1",
        "使用场景2"
    ]
    default = False

    associated_types = ["text", "command"]

    async def process(self) -> Tuple[bool, str]:
        """插件核心逻辑"""
        # 你的代码逻辑...
        return True, "执行结果"
```

## 关键词触发插件

```python
@register_action
class SearchAction(PluginAction):
    action_name = "search_action"
    action_description = "智能搜索功能"
    
    # 两个模式都使用关键词触发
    focus_activation_type = ActionActivationType.KEYWORD
    normal_activation_type = ActionActivationType.KEYWORD
    activation_keywords = ["搜索", "查找", "什么是", "search", "find"]
    keyword_case_sensitive = False
    
    mode_enable = ChatMode.ALL
    parallel_action = False
    enable_plugin = True
    
    async def process(self) -> Tuple[bool, str]:
        # 搜索逻辑
        query = self.action_data.get("query", "")
        if not query:
            return False, "没有提供搜索关键词"
            
        # 搜索实现...
        result = f"关于 {query} 的搜索结果..."
        return True, result
```

## 并行辅助动作

```python
@register_action
class EmotionAction(PluginAction):
    action_name = "emotion_action"
    action_description = "情感表达动作"
    
    focus_activation_type = ActionActivationType.LLM_JUDGE
    normal_activation_type = ActionActivationType.RANDOM
    random_activation_probability = 0.05  # 5%概率
    
    mode_enable = ChatMode.ALL
    parallel_action = True  # 与回复并行执行
    enable_plugin = True
    
    async def process(self) -> Tuple[bool, str]:
        # 获取最近消息
        messages = self.get_recent_messages(count=3)
        
        # 情感分析逻辑...
        emotion = "happy"  # 分析结果
        
        # 发送表情包或情感表达
        if emotion == "happy":
            await self.send_message(type="text", data="😊")
        elif emotion == "sad":
            await self.send_message(type="text", data="😢")
        
        # 并行动作通常不返回文本
        return True, ""
```

## Focus专享高级功能

```python
@register_action
class AdvancedAnalysisAction(PluginAction):
    action_name = "advanced_analysis"
    action_description = "高级分析功能"
    
    focus_activation_type = ActionActivationType.LLM_JUDGE
    normal_activation_type = ActionActivationType.ALWAYS  # 不会生效
    
    mode_enable = ChatMode.FOCUS  # 仅在Focus模式启用
    parallel_action = False
    enable_plugin = True
    
    async def process(self) -> Tuple[bool, str]:
        # 获取可用模型
        models = self.get_available_models()
        
        # 使用高级模型进行分析
        success, response, reasoning, model_name = await self.generate_with_model(
            prompt="进行高级分析的提示词",
            model_config=models["advanced_model"],
            max_tokens=2000
        )
        
        if not success:
            return False, "分析失败"
            
        return True, f"分析结果：{response}"
```

## 禁言功能示例

```python
@register_action
class MuteAction(PluginAction):
    action_name = "mute_action"
    action_description = "禁言群成员"
    
    focus_activation_type = ActionActivationType.KEYWORD
    normal_activation_type = ActionActivationType.KEYWORD
    activation_keywords = ["禁言", "口球", "ban", "mute"]
    keyword_case_sensitive = False
    
    mode_enable = ChatMode.ALL
    parallel_action = False
    enable_plugin = True
    
    action_parameters = {
        "target": "要禁言的目标",
        "duration": "禁言时长（秒）",
        "reason": "禁言原因（可选）"
    }
    
    async def process(self) -> Tuple[bool, str]:
        # 获取参数
        target = self.action_data.get("target", "")
        duration_str = self.action_data.get("duration", "60")
        reason = self.action_data.get("reason", "未指定原因")
        
        # 检查聊天类型
        chat_type = self.get_chat_type()
        if chat_type != "group":
            return False, "禁言功能仅在群聊中可用"
            
        # 获取用户ID
        try:
            platform, user_id = await self.get_user_id_by_person_name(target)
        except Exception as e:
            logger.error(f"{self.log_prefix} 获取用户ID失败: {e}")
            return False, f"无法识别用户 {target}"
            
        # 发送禁言命令
        try:
            await self.send_message(
                type="command",
                data={"name": "GROUP_BAN", "args": {"qq_id": str(user_id), "duration": duration_str}},
                display_message=f"我已禁言 {target} {duration_str}秒，原因：{reason}"
            )
            return True, f"已禁言 {target} {duration_str}秒"
        except Exception as e:
            logger.error(f"{self.log_prefix} 禁言失败: {e}")
            return False, "禁言操作失败"
``` 