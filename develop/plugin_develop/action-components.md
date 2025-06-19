# ⚡ Action组件详解

## 📖 什么是Action

Action是给麦麦在回复之外提供额外功能的智能组件，**由麦麦的决策系统自主选择是否使用**，具有随机性和拟人化的调用特点。Action不是直接响应用户命令，而是让麦麦根据聊天情境智能地选择合适的动作，使其行为更加自然和真实。

### 🎯 Action的特点

- 🧠 **智能激活**：麦麦根据多种条件智能判断是否使用
- 🎲 **随机性**：增加行为的不可预测性，更接近真人交流
- 🤖 **拟人化**：让麦麦的回应更自然、更有个性
- 🔄 **情境感知**：基于聊天上下文做出合适的反应

## 🎯 两层决策机制

Action采用**两层决策机制**来优化性能和决策质量：

### 第一层：激活控制（Activation Control）

**激活决定麦麦是否"知道"这个Action的存在**，即这个Action是否进入决策候选池。**不被激活的Action麦麦永远不会选择**。

> 🎯 **设计目的**：在加载许多插件的时候降低LLM决策压力，避免让麦麦在过多的选项中纠结。

#### 激活类型说明

| 激活类型      | 说明                                        | 使用场景                 |
| ------------- | ------------------------------------------- | ------------------------ |
| `NEVER`     | 从不激活，Action对麦麦不可见                | 临时禁用某个Action       |
| `ALWAYS`    | 永远激活，Action总是在麦麦的候选池中        | 核心功能，如回复、不回复 |
| `LLM_JUDGE` | 通过LLM智能判断当前情境是否需要激活此Action | 需要智能判断的复杂场景   |
| `RANDOM`    | 基于随机概率决定是否激活                    | 增加行为随机性的功能     |
| `KEYWORD`   | 当检测到特定关键词时激活                    | 明确触发条件的功能       |

#### 聊天模式控制

| 模式                | 说明                     |
| ------------------- | ------------------------ |
| `ChatMode.FOCUS`  | 仅在专注聊天模式下可激活 |
| `ChatMode.NORMAL` | 仅在普通聊天模式下可激活 |
| `ChatMode.ALL`    | 所有模式下都可激活       |

### 第二层：使用决策（Usage Decision）

**在Action被激活后，使用条件决定麦麦什么时候会"选择"使用这个Action**。

这一层由以下因素综合决定：

- `action_require`：使用场景描述，帮助LLM判断何时选择
- `action_parameters`：所需参数，影响Action的可执行性
- 当前聊天上下文和麦麦的决策逻辑

### 🎬 决策流程示例

假设有一个"发送表情"Action：

```python
class EmojiAction(BaseAction):
    # 第一层：激活控制
    focus_activation_type = ActionActivationType.RANDOM  # 专注模式下随机激活
    normal_activation_type = ActionActivationType.KEYWORD  # 普通模式下关键词激活
    activation_keywords = ["表情", "emoji", "😊"]
  
    # 第二层：使用决策
    action_require = [
        "表达情绪时可以选择使用",
        "增加聊天趣味性",
        "不要连续发送多个表情"
    ]
```

**决策流程**：

1. **第一层激活判断**：

   - 普通模式：只有当用户消息包含"表情"、"emoji"或"😊"时，麦麦才"知道"可以使用这个Action
   - 专注模式：随机激活，有概率让麦麦"看到"这个Action
2. **第二层使用决策**：

   - 即使Action被激活，麦麦还会根据 `action_require`中的条件判断是否真正选择使用
   - 例如：如果刚刚已经发过表情，根据"不要连续发送多个表情"的要求，麦麦可能不会选择这个Action

## 📋 Action必须项清单

每个Action类都**必须**包含以下属性：

### 1. 激活控制必须项

```python
# 专注模式下的激活类型
focus_activation_type = ActionActivationType.LLM_JUDGE

# 普通模式下的激活类型
normal_activation_type = ActionActivationType.KEYWORD

# 启用的聊天模式
mode_enable = ChatMode.ALL

# 是否允许与其他Action并行执行
parallel_action = False
```

### 2. 基本信息必须项

```python
# Action的唯一标识名称
action_name = "my_action"

# Action的功能描述
action_description = "描述这个Action的具体功能和用途"
```

### 3. 功能定义必须项

```python
# Action参数定义 - 告诉LLM执行时需要什么参数
action_parameters = {
    "param1": "参数1的说明",
    "param2": "参数2的说明"
}

# Action使用场景描述 - 帮助LLM判断何时"选择"使用
action_require = [
    "使用场景描述1",
    "使用场景描述2"
]

# 关联的消息类型 - 说明Action能处理什么类型的内容
associated_types = ["text", "emoji", "image"]
```

### 4. 新API导入必须项

使用新插件系统时，必须导入所需的API模块：

```python
# 导入新API模块
from src.plugin_system.apis import generator_api, send_api, emoji_api

# 如果需要使用其他API
from src.plugin_system.apis import llm_api, database_api, message_api
```

### 5. 动作记录必须项

每个 Action 在执行完成后，**必须**使用 `store_action_info` 记录动作信息：

```python
async def execute(self) -> Tuple[bool, str]:
    # ... 执行动作的代码 ...
  
    if success:
        # 存储动作信息 - 使用新API格式
        await self.store_action_info(
            action_build_into_prompt=True,  # 让麦麦知道这个动作
            action_prompt_display=f"执行了xxx动作，参数：{param}",  # 动作描述
            action_done=True,  # 动作是否完成
        )
        return True, "动作执行成功"
```

> ⚠️ **重要提示**：新API格式中不再需要手动传递 `thinking_id` 等参数，BaseAction会自动处理。

## 🚀 新API使用指南

### 📨 消息发送API

新的消息发送API更加简洁，自动处理群聊/私聊逻辑：

```python
class MessageAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 发送文本消息 - 自动判断群聊/私聊
        await self.send_text("Hello World!")
  
        # 发送表情包
        emoji_base64 = await emoji_api.get_by_description("开心")
        if emoji_base64:
            await self.send_emoji(emoji_base64)
  
        # 发送图片
        await self.send_image(image_base64)
  
        # 发送自定义类型消息
        await self.send_custom("video", video_data, typing=True)
  
        return True, "消息发送完成"
```

### 🤖 智能生成API (replyer_1)

使用replyer_1生成个性化内容：

```python
class SmartReplyAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 构建生成参数
        reply_data = {
            "text": "请生成一个友好的回复",
            "style": "casual",
            "topic": "日常聊天",
            "replyer_name": "replyer_1"  # 指定使用replyer_1
        }
  
        # 使用generator_api生成回复
        success, reply_set = await generator_api.generate_reply(
            chat_stream=self.chat_stream,
            action_data=reply_data,
            platform=self.platform,
            chat_id=self.chat_id,
            is_group=self.is_group
        )
  
        if success and reply_set:
            # 提取并发送文本回复
            for reply_type, reply_content in reply_set:
                if reply_type == "text":
                    await self.send_text(reply_content)
                elif reply_type == "emoji":
                    await self.send_emoji(reply_content)
    
            # 记录动作
            await self.store_action_info(
                action_build_into_prompt=True,
                action_prompt_display=f"使用replyer_1生成了智能回复",
                action_done=True
            )
    
            return True, "智能回复生成成功"
        else:
            return False, "回复生成失败"
```

### ⚙️ 配置访问API

使用便捷的配置访问方法：

```python
class ConfigurableAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 获取插件配置 - 支持嵌套键访问
        enable_feature = self.get_config("features.enable_smart_mode", False)
        max_length = self.get_config("limits.max_text_length", 200)
        style = self.get_config("behavior.response_style", "friendly")
  
        if enable_feature:
            # 启用高级功能
            pass
  
        return True, "配置获取成功"
```

### 📊 数据库API

使用新的数据库API存储和查询数据：

```python
class DataAction(BaseAction):
    async def execute(self) -> Tuple[bool, str]:
        # 使用database_api
        from src.plugin_system.apis import database_api
  
        # 存储数据
        await database_api.store_action_info(
            chat_stream=self.chat_stream,
            action_name=self.action_name,
            action_data=self.action_data,
            # ... 其他参数
        )
  
        return True, "数据存储完成"
```

## 🔧 激活类型详解

### KEYWORD激活

当检测到特定关键词时激活Action：

```python
class GreetingAction(BaseAction):
    focus_activation_type = ActionActivationType.KEYWORD
    normal_activation_type = ActionActivationType.KEYWORD
  
    # 关键词配置
    activation_keywords = ["你好", "hello", "hi", "嗨"]
    keyword_case_sensitive = False  # 不区分大小写
  
    async def execute(self) -> Tuple[bool, str]:
        # 可选：使用replyer_1生成个性化问候
        if self.get_config("greeting.use_smart_reply", False):
            greeting_data = {
                "text": "生成一个友好的问候语",
                "replyer_name": "replyer_1"
            }
    
            success, reply_set = await generator_api.generate_reply(
                chat_stream=self.chat_stream,
                action_data=greeting_data
            )
    
            if success:
                for reply_type, content in reply_set:
                    if reply_type == "text":
                        await self.send_text(content)
                        break
                return True, "发送智能问候"
  
        # 传统问候方式
        await self.send_text("你好！很高兴见到你！")
        return True, "发送问候"
```

### LLM_JUDGE激活

通过LLM智能判断是否激活：

```python
class HelpAction(BaseAction):
    focus_activation_type = ActionActivationType.LLM_JUDGE
    normal_activation_type = ActionActivationType.LLM_JUDGE
  
    # LLM判断提示词
    llm_judge_prompt = """
    判定是否需要使用帮助动作的条件：
    1. 用户表达了困惑或需要帮助
    2. 用户提出了问题但没有得到满意答案
    3. 对话中出现了技术术语或复杂概念
  
    请回答"是"或"否"。
    """
  
    async def execute(self) -> Tuple[bool, str]:
        # 使用replyer_1生成帮助内容
        help_data = {
            "text": "用户需要帮助，请提供适当的帮助信息",
            "help_type": self.action_data.get("help_type", "general"),
            "replyer_name": "replyer_1"
        }
  
        success, reply_set = await generator_api.generate_reply(
            chat_stream=self.chat_stream,
            action_data=help_data
        )
  
        if success:
            for reply_type, content in reply_set:
                if reply_type == "text":
                    await self.send_text(content)
            return True, "提供了帮助"
        else:
            await self.send_text("我来帮助你！有什么问题吗？")
            return True, "提供了默认帮助"
```

### RANDOM激活

基于随机概率激活：

```python
class SurpriseAction(BaseAction):
    focus_activation_type = ActionActivationType.RANDOM
    normal_activation_type = ActionActivationType.RANDOM
  
    # 随机激活概率
    random_activation_probability = 0.1  # 10%概率激活
  
    async def execute(self) -> Tuple[bool, str]:
        import random
  
        surprises = ["🎉", "✨", "🌟", "💝", "🎈"]
        selected = random.choice(surprises)
  
        await self.send_emoji(selected)
        return True, f"发送了惊喜表情: {selected}"
```
