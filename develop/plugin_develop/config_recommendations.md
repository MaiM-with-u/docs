# 配置模式推荐

本文档提供了几种推荐的插件配置模式，适用于不同的使用场景。选择合适的配置模式可以优化插件的性能和用户体验。

## 模式1：智能自适应（推荐）

```python
# Focus模式智能判定，Normal模式快速触发
focus_activation_type = ActionActivationType.LLM_JUDGE
normal_activation_type = ActionActivationType.KEYWORD
activation_keywords = ["相关", "关键词"]
mode_enable = ChatMode.ALL
parallel_action = False  # 根据具体需求调整
```

**适用场景**：
- 需要理解上下文的复杂功能
- 既需要智能判断又需要高性能的场景
- 主要内容生成类插件

**优势**：
- 在Focus模式下能够智能理解用户意图
- 在Normal模式下通过关键词快速响应
- 平衡了智能性和性能

## 模式2：统一关键词

```python
# 两个模式都使用关键词，确保行为一致
focus_activation_type = ActionActivationType.KEYWORD
normal_activation_type = ActionActivationType.KEYWORD
activation_keywords = ["画", "图片", "生成"]
mode_enable = ChatMode.ALL
```

**适用场景**：
- 明确的命令式功能
- 需要精确控制触发条件的场景
- 高频使用的工具类功能

**优势**：
- 性能最优，响应速度快
- 行为可预测，用户体验一致
- 避免误触发

## 模式3：Focus专享功能

```python
# 仅在Focus模式启用的高级功能
focus_activation_type = ActionActivationType.LLM_JUDGE
mode_enable = ChatMode.FOCUS
parallel_action = False
```

**适用场景**：
- 需要深度分析的高级功能
- 资源密集型操作
- 对话质量要求高的场景

**优势**：
- 专注于高质量对话
- 避免在Normal模式下消耗资源
- 适合复杂任务处理

## 模式4：随机娱乐功能

```python
# 增加趣味性的随机功能
focus_activation_type = ActionActivationType.RANDOM
normal_activation_type = ActionActivationType.RANDOM
random_activation_probability = 0.08  # 8%概率
mode_enable = ChatMode.ALL
parallel_action = True  # 通常与回复并行
```

**适用场景**：
- 增加对话趣味性的功能
- 非核心的辅助性功能
- 表情、反应等情感表达

**优势**：
- 增加对话的不可预测性和趣味性
- 不干扰主要对话流程
- 提升用户体验

## 模式5：高性能并行辅助

```python
# 高性能辅助功能，与回复并行
focus_activation_type = ActionActivationType.KEYWORD
normal_activation_type = ActionActivationType.KEYWORD
activation_keywords = ["状态", "统计"]
mode_enable = ChatMode.ALL
parallel_action = True
```

**适用场景**：
- 状态更新、数据收集等后台操作
- 不需要替代主回复的辅助功能
- 需要快速响应的场景

**优势**：
- 不影响主对话流程
- 提高整体响应速度
- 改善多任务处理能力

## 模式6：基础必需功能

```python
# 基础必需功能，始终激活
focus_activation_type = ActionActivationType.ALWAYS
normal_activation_type = ActionActivationType.ALWAYS
mode_enable = ChatMode.ALL
parallel_action = False
```

**适用场景**：
- 核心回复功能
- 基础系统功能
- 必须始终可用的功能

**优势**：
- 确保关键功能始终可用
- 简化配置
- 提供基础保障

## 选择建议

1. **首次开发**：从模式1（智能自适应）开始
2. **性能敏感**：考虑模式2（统一关键词）
3. **高级功能**：考虑模式3（Focus专享）
4. **辅助功能**：考虑模式4（随机）或模式5（并行）
5. **核心功能**：考虑模式6（始终激活）

根据实际使用情况和用户反馈，可以随时调整配置模式，以达到最佳效果。 