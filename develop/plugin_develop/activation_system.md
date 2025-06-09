# 动作激活系统

## 概述

MaiBot采用Planner机制对动作进行选择，但并不是所有被注册启用的动作都会被加入Planner。这是因为Planner的LLM有其性能上限，加入所有action会导致其决策能力下降，决策时间延长。

因此，MaiBot引入了动作激活系统，不同的动作可以采用不同的激活策略，当动作满足激活条件，才会被Planner选择。

## 不同聊天模式的激活类型

Focus模式和Normal模式拥有不同的激活策略：

**Focus模式**：智能优先
- 支持复杂的LLM判定，能够通过llm判断上下文激活action
- 适合需要深度分析的场景

**Normal模式**：性能优先  
- 采用简单的随机触发，或者关键词判定来激活action
- 确保快速响应用户

## 四种激活条件类型

### 1. ALWAYS - 总是激活

ALWAYS类型的动作，将会永远被激活，Planner一直可以考虑此类动作

```python
focus_activation_type = ActionActivationType.ALWAYS
normal_activation_type = ActionActivationType.ALWAYS
```

**用途**：基础必需动作，如`reply_action`、`no_reply_action`

### 2. KEYWORD - 关键词触发

KEYWORD将会检测到关键词后激活

```python
focus_activation_type = ActionActivationType.KEYWORD
normal_activation_type = ActionActivationType.KEYWORD
activation_keywords = ["画", "画图", "生成图片", "draw"]
keyword_case_sensitive = False
```

**用途**：精确命令式触发，如图片生成、搜索等

### 3. LLM_JUDGE - 智能判定（仅focus）

较小参数的LLM对上下文判断，根据action的描述和llm_judge_prompt进行判定

```python
focus_activation_type = ActionActivationType.LLM_JUDGE
```

**用途**：需要上下文理解的复杂判定，如情感分析、意图识别

### 4. RANDOM - 随机激活

```python
focus_activation_type = ActionActivationType.RANDOM
normal_activation_type = ActionActivationType.RANDOM
random_activation_probability = 0.1  # 10%概率
```

**用途**：增加不可预测性和趣味性，如随机使用表情包

## 并行动作系统（仅Normal）

支持动作与回复生成同时执行：

```python
# 并行动作：与回复生成同时执行
parallel_action = True   # 提升用户体验，适用于辅助性动作

# 串行动作：替代回复生成（传统行为）
parallel_action = False  # 默认值，适用于主要内容生成
```

**适用场景**：
- **并行动作**：情感表达、状态变更、禁言
- **串行动作**：图片生成、搜索查询、内容创作

## 模式启用控制

```python
from src.chat.chat_mode import ChatMode

mode_enable = ChatMode.ALL      # 在所有模式下启用（默认）
mode_enable = ChatMode.FOCUS    # 仅在Focus模式启用
mode_enable = ChatMode.NORMAL   # 仅在Normal模式启用
```

## 性能优化建议

### 激活类型选择
- **ALWAYS**：仅用于基础必需动作
- **KEYWORD**：明确的命令式动作，性能最佳
- **LLM_JUDGE**：复杂判断，建议仅在Focus模式使用
- **RANDOM**：娱乐功能，低概率触发

### 双模式配置
- **智能自适应**：Focus用LLM_JUDGE，Normal用KEYWORD（推荐）
- **性能优先**：两个模式都用KEYWORD或RANDOM
- **功能分离**：高级功能仅在Focus模式启用

### 并行动作使用
- **parallel_action = True**：辅助性、非内容生成类动作
- **parallel_action = False**：主要内容生成、需要完整注意力的动作 