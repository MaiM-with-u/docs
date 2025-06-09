# 迁移指南

## 从v0.1迁移到v0.2

MaiBot插件系统从v0.1升级到v0.2版本引入了一些重要变更，主要是双激活类型系统和并行动作支持。本指南将帮助你将现有插件从v0.1迁移到v0.2。

### 主要变更

1. **双激活类型系统**：替代了单一的`action_activation_type`
2. **并行动作支持**：新增`parallel_action`属性
3. **模式启用控制**：新增`mode_enable`属性

### 1. 更新激活类型系统

旧版本中，插件只使用单一的`action_activation_type`属性来控制激活方式：

```python
# v0.1 旧版本代码（已不再支持）
class OldPluginAction(PluginAction):
    action_name = "old_action"
    action_activation_type = ActionActivationType.LLM_JUDGE  # 或 ALWAYS、KEYWORD、RANDOM
    # 其他配置...
```

新版本v0.2引入了双激活类型系统，需要分别为Focus和Normal模式指定激活类型：

```python
# v0.2 新版本代码
class NewPluginAction(PluginAction):
    action_name = "new_action"
    
    # 双激活类型配置
    focus_activation_type = ActionActivationType.LLM_JUDGE      # Focus模式使用智能判定
    normal_activation_type = ActionActivationType.KEYWORD       # Normal模式使用关键词
    
    # 如果使用关键词激活，必须提供关键词列表
    activation_keywords = ["关键词1", "关键词2", "keyword"]
    keyword_case_sensitive = False  # 关键词是否区分大小写
    
    # 如果使用随机激活，可以设置概率
    random_activation_probability = 0.1  # 10%概率（仅当使用RANDOM类型时有效）
    
    # 模式启用控制
    mode_enable = ChatMode.ALL  # 在所有模式下启用
    
    # 并行控制
    parallel_action = False  # 是否与回复并行执行
    
    # 其他配置...
```

### 2. 根据原有激活类型选择对应策略

根据原有的激活类型，按照下表进行迁移：

| 原v0.1激活类型 | v0.2推荐配置 | 说明 |
|---------------|------------|------|
| ALWAYS | focus_activation_type = ALWAYS<br>normal_activation_type = ALWAYS | 保持始终激活 |
| LLM_JUDGE | focus_activation_type = LLM_JUDGE<br>normal_activation_type = KEYWORD<br>+ 添加activation_keywords | Focus模式保持智能判定，Normal模式使用关键词 |
| KEYWORD | focus_activation_type = KEYWORD<br>normal_activation_type = KEYWORD<br>+ 保持原有activation_keywords | 两种模式都使用关键词触发 |
| RANDOM | focus_activation_type = RANDOM<br>normal_activation_type = RANDOM<br>+ 保持原有random_activation_probability | 两种模式都使用随机触发 |

### 3. 添加新的必要配置

除了激活类型外，还需要添加以下新配置：

```python
# 添加模式控制（必须）
from src.chat.chat_mode import ChatMode
mode_enable = ChatMode.ALL  # 或 ChatMode.FOCUS / ChatMode.NORMAL

# 添加并行控制（必须）
parallel_action = False  # 串行执行（替代回复）
# 或
parallel_action = True   # 并行执行（与回复同时）

# 添加插件控制（可选）
enable_plugin = True  # 是否启用此插件
```

### 4. 完整迁移示例

```python
# v0.1 旧版本
class OldMuteAction(PluginAction):
    action_name = "mute_action"
    action_description = "禁言功能"
    action_activation_type = ActionActivationType.KEYWORD
    activation_keywords = ["禁言", "口球", "ban", "mute"]
    default = True

# v0.2 新版本
class NewMuteAction(PluginAction):
    action_name = "mute_action"
    action_description = "禁言功能"
    
    # 双激活类型
    focus_activation_type = ActionActivationType.KEYWORD
    normal_activation_type = ActionActivationType.KEYWORD
    activation_keywords = ["禁言", "口球", "ban", "mute"]
    keyword_case_sensitive = False
    
    # 新增配置
    mode_enable = ChatMode.ALL
    parallel_action = False  # 禁言通常替代回复
    enable_plugin = True
    default = True
    
    # 其他配置保持不变...
```

### 5. 迁移检查清单

确保完成以下所有步骤：

- [ ] 移除旧的`action_activation_type`属性
- [ ] 添加`focus_activation_type`和`normal_activation_type`
- [ ] 如使用KEYWORD，确保提供`activation_keywords`
- [ ] 如使用RANDOM，确保设置`random_activation_probability`
- [ ] 添加`mode_enable`指定启用模式
- [ ] 添加`parallel_action`指定是否并行执行
- [ ] 添加`enable_plugin`控制插件启用状态

### 6. 常见问题

#### Q: 我的插件在v0.2中不再被激活了
A: 检查是否正确设置了双激活类型和相关参数。特别是使用KEYWORD时必须提供activation_keywords。

#### Q: 我想让插件在Focus模式下更智能，但在Normal模式下更高效
A: 使用智能自适应配置：
```python
focus_activation_type = ActionActivationType.LLM_JUDGE
normal_activation_type = ActionActivationType.KEYWORD
activation_keywords = ["相关关键词"]
```

#### Q: 我的插件需要替代主回复还是可以并行执行？
A: 根据插件功能决定：
- 如果是生成内容的主要功能（如搜索、绘图），设置`parallel_action = False`
- 如果是辅助功能（如情感表达、状态更新），设置`parallel_action = True`

#### Q: 我的插件只需要在特定模式下运行
A: 使用`mode_enable`进行控制：
```python
# 仅在Focus模式启用
mode_enable = ChatMode.FOCUS

# 仅在Normal模式启用
mode_enable = ChatMode.NORMAL
```

### 7. 性能优化建议

1. **避免在Normal模式使用LLM_JUDGE**
   - Normal模式追求性能，建议使用KEYWORD或RANDOM

2. **关键词设计**
   - 包含同义词和英文对应词
   - 避免过于宽泛的关键词
   - 关键词数量控制在10个以内

3. **随机概率控制**
   - 娱乐功能：0.05-0.1
   - 辅助功能：0.1-0.3
   - 避免设置过高概率导致频繁触发

完成以上步骤后，你的插件将可以在v0.2版本的系统中正常运行，并充分利用新版本的双激活类型系统和并行执行功能。 