## 记忆系统

### 记忆系统能帮你什么
- **记住重点**：从聊天总结成“主题 + 一句话记忆”
- **会联想**：相关的主题会自动建立联系，后续对话能更容易“想起来”。
- **会自我打理**：定时学习新内容、忘掉不重要的、把重复的合在一起。

### 什么时候生效
- **自动学习**：隔一段时间，系统会从历史聊天里挑几段内容，自动总结成记忆（你可调“隔多久学一次”）。
- **回复前回忆**：要回复时会先看你刚说的内容，找几个关键词，从记忆里翻一翻有关的再来回答。


## 我可以怎么自定义
所有设置都在 `config/bot_config.toml` 的 `[memory]` 部分。

- **开关**
  - `enable_memory`: 开启/关闭整个记忆系统。
  - `enable_instant_memory`: 开启/关闭即时记忆（逐条判断是否值得存一条记忆）。（这是一个测试功能，并不稳定）

- **学习（学多少、学多久学一次）**
  - `memory_build_interval`：隔多久学习一次（秒）。数值小=更勤奋，可能更“话痨”。
  - `memory_build_sample_num`：每次学习挑几段聊天。
  - `memory_build_sample_length`：每段最多看多少条消息。
  - `memory_compress_rate`：压缩力度。高一点=主题提得多，可能更啰嗦；低一点=更精炼。
  - `memory_build_distribution`：决定“更偏向回看多久以前”的参数，保持默认即可。
  - `memory_ban_words`：不想被当成记忆的词（例如：表情包、图片等）。

- **遗忘（忘的快不快、忘多少）**
  - `forget_memory_interval`：隔多久执行一次“遗忘”。
  - `memory_forget_time`：很久没用到的“连接”会被当作旧了，这里设置“多久算旧”。
  - `memory_forget_percentage`：每次只抽一部分来检查，比例越大，每次清理越多。

- **整合（把重复/很像的合并）**
  - `consolidate_memory_interval`：隔多久执行一次“整合”。
  - `consolidation_similarity_threshold`：多像才算“重复到可以合并”。阈值高=更严格，合并更少。
  - `consolidate_memory_percentage`：每次只抽一部分“有多条记忆的主题”来检查，比例越大，每次合并越多。

### 建议示例（可按需微调）

```toml
[memory]
enable_memory = true
memory_build_interval = 600          # 10分钟学一次
memory_build_sample_num = 3          # 每次抽3段
memory_build_sample_length = 40      # 每段最多看40条
memory_compress_rate = 0.15          # 主题略多，获取信息更全

forget_memory_interval = 1000        # 约16分钟清理一次
memory_forget_time = 24              # 连接24小时没动算“旧”
memory_forget_percentage = 0.02      # 每次抽2%来检查

consolidate_memory_interval = 1000   # 约16分钟整合一次
consolidation_similarity_threshold = 0.6
consolidate_memory_percentage = 0.05 # 每次抽5%有多条记忆的主题

enable_instant_memory = false
memory_ban_words = ["表情包", "图片", "回复", "聊天记录"]
```

### 重要提醒（名字要对得上）
- 如果你的配置里看到的是 `consolidation_check_percentage`，请改成 `consolidate_memory_percentage`。系统实际识别的是后者，否则会用默认值。

## 小建议
- 想“多学一点”：
  - 稍微提高 `memory_build_sample_num` 和 `memory_build_sample_length`。
  - `memory_compress_rate` 稍微大一点会提更多主题，但可能更啰嗦，按需权衡。
- 想“更干净一些”：
  - 提高 `memory_forget_percentage`（更积极清理旧连接/空节点）。
  - 提高 `consolidation_similarity_threshold`（更难被判定为重复，合并更少）。
  - 或者降低 `consolidate_memory_percentage`（每次整合检查少一点）。

## 常见疑问
- **为什么感觉没记住？**
  - 可能还没到下一次学习周期，或这段内容被判断“不值得记忆”。可以降低 `memory_build_interval` 或暂时提高 `memory_compress_rate` 观察。
- **记忆变多有点杂？**
  - 稍微提高 `memory_forget_percentage` 和/或降低 `consolidate_memory_percentage`，让清理更积极、整合更克制。
- **即时记忆和长期记忆有什么不同？**
  - 即时记忆偏“随手记一笔”，适合短期事项；长期记忆是“主题-摘要-连接”的结构化图，更适合被后续关键词激活与联想。


