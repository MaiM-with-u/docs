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

### 4. 执行方法必须项

```python
async def execute(self) -> Tuple[bool, str]:
    """
    执行Action的主要逻辑
    
    Returns:
        Tuple[bool, str]: (是否成功, 执行结果描述)
    """
    # 执行动作的代码
    success = True
    message = "动作执行成功"
    
    return success, message
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
        # 执行问候逻辑
        return True, "发送了问候"
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
        # 执行帮助逻辑
        return True, "提供了帮助"
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
        # 执行惊喜动作
        return True, "发送了惊喜内容"
```

### ALWAYS激活

永远激活，常用于核心功能：

```python
class CoreAction(BaseAction):
    focus_activation_type = ActionActivationType.ALWAYS
    normal_activation_type = ActionActivationType.ALWAYS
    
    async def execute(self) -> Tuple[bool, str]:
        # 执行核心功能
        return True, "执行了核心功能"
```

### NEVER激活

从不激活，用于临时禁用：

```python
class DisabledAction(BaseAction):
    focus_activation_type = ActionActivationType.NEVER
    normal_activation_type = ActionActivationType.NEVER
    
    async def execute(self) -> Tuple[bool, str]:
        # 这个方法不会被调用
        return False, "已禁用"
```

## 📚 BaseAction内置属性和方法

### 内置属性

```python
class MyAction(BaseAction):
    def __init__(self):
        # 消息相关属性
        self.message          # 当前消息对象
        self.chat_stream      # 聊天流对象
        self.user_id          # 用户ID
        self.user_nickname    # 用户昵称
        self.platform         # 平台类型 (qq, telegram等)
        self.chat_id          # 聊天ID
        self.is_group         # 是否群聊
        
        # Action相关属性
        self.action_data      # Action执行时的数据
        self.thinking_id      # 思考ID
        self.matched_groups   # 匹配到的组(如果有正则匹配)
```

### 内置方法

```python
class MyAction(BaseAction):
    # 配置相关
    def get_config(self, key: str, default=None):
        """获取配置值"""
        pass
    
    # 消息发送相关
    async def send_text(self, text: str):
        """发送文本消息"""
        pass
    
    async def send_emoji(self, emoji_base64: str):
        """发送表情包"""
        pass
    
    async def send_image(self, image_base64: str):
        """发送图片"""
        pass
    
    # 动作记录相关
    async def store_action_info(self, **kwargs):
        """记录动作信息"""
        pass
```

## 🎯 完整Action示例

```python
from src.plugin_system import BaseAction, ActionActivationType, ChatMode
from typing import Tuple

class ExampleAction(BaseAction):
    """示例Action - 展示完整的Action结构"""
    
    # === 激活控制 ===
    focus_activation_type = ActionActivationType.LLM_JUDGE
    normal_activation_type = ActionActivationType.KEYWORD
    mode_enable = ChatMode.ALL
    parallel_action = False
    
    # 关键词激活配置
    activation_keywords = ["示例", "测试", "example"]
    keyword_case_sensitive = False
    
    # LLM判断提示词
    llm_judge_prompt = "当用户需要示例或测试功能时激活"
    
    # 随机激活概率（如果使用RANDOM类型）
    random_activation_probability = 0.2
    
    # === 基本信息 ===
    action_name = "example_action"
    action_description = "这是一个示例Action，用于演示Action的完整结构"
    
    # === 功能定义 ===
    action_parameters = {
        "content": "要处理的内容",
        "type": "处理类型",
        "options": "可选配置"
    }
    
    action_require = [
        "用户需要示例功能时使用",
        "适合用于测试和演示",
        "不要在正式对话中频繁使用"
    ]
    
    associated_types = ["text", "emoji"]
    
    async def execute(self) -> Tuple[bool, str]:
        """执行示例Action"""
        try:
            # 获取Action参数
            content = self.action_data.get("content", "默认内容")
            action_type = self.action_data.get("type", "default")
            
            # 获取配置
            enable_feature = self.get_config("example.enable_advanced", False)
            max_length = self.get_config("example.max_length", 100)
            
            # 执行具体逻辑
            if action_type == "greeting":
                await self.send_text(f"你好！这是示例内容：{content}")
            elif action_type == "info":
                await self.send_text(f"信息：{content[:max_length]}")
            else:
                await self.send_text("执行了示例Action")
            
            # 记录动作信息
            await self.store_action_info(
                action_build_into_prompt=True,
                action_prompt_display=f"执行了示例动作：{action_type}",
                action_done=True
            )
            
            return True, f"示例Action执行成功，类型：{action_type}"
            
        except Exception as e:
            return False, f"执行失败：{str(e)}"
```

## 🎯 最佳实践

### 1. Action设计原则

- **单一职责**：每个Action只负责一个明确的功能
- **智能激活**：合理选择激活类型，避免过度激活
- **清晰描述**：提供准确的`action_require`帮助LLM决策
- **错误处理**：妥善处理执行过程中的异常情况

### 2. 性能优化

- **激活控制**：使用合适的激活类型减少不必要的LLM调用
- **并行执行**：谨慎设置`parallel_action`，避免冲突
- **资源管理**：及时释放占用的资源

### 3. 调试技巧

- **日志记录**：在关键位置添加日志
- **参数验证**：检查`action_data`的有效性
- **配置测试**：测试不同配置下的行为
