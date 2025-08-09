## 表达学习（Expression Learning）

### 这有什么用？
- 通过自动学习群体/私聊中的常见说法与语气，沉淀为可复用的两类表达：
  - 语言风格（style）：习惯用语、口头禅、梗的表达方式。
  - 句法特点（grammar）：句长、常见语病、简化写法等表达结构。
- 回复阶段会基于已学习的表达进行加权抽样与筛选，从而生成更贴合当前聊天语境的回复，提高拟人化与融群感。
- 学到的表达会按活跃度进行权重累积与自然衰减，长期保持“常用更常用，冷门会被淘汰”的效果。

### 配置位置
- 文件：`config/bot_config.toml`
- 区块：`[expression]`

该区块包含两个与“表达学习”相关的选项：`expression_learning` 与 `expression_groups`。

---

### 选项一：expression_learning（开关与学习强度）

- 作用：为全局或某个特定聊天流配置“是否使用表达”“是否进行学习”“学习强度”。
- 格式：

```toml
[expression]
expression_learning = [
  ["", "enable", "enable", 1.0],                # 全局：使用表达=开，学习=开，强度=1.0
  ["qq:1919810:group", "enable", "enable", 1.5], # 指定群聊：使用表达=开，学习=开，强度=1.5
  ["qq:114514:private", "enable", "disable", 0.5] # 指定私聊：使用表达=开，学习=关，强度=0.5
]
```

- 字段说明（按顺序）：
  - chat_stream_id：字符串，形如 `platform:id:type`。
    - 群聊：`qq:123456:group`
    - 私聊：`qq:123456:private`
    - 为空串 `""` 表示“全局默认配置”。
  - use_expression：是否在该聊天“使用已学表达”，`enable`/`disable`。
  - enable_learning：是否在该聊天“继续学习表达”，`enable`/`disable`。
  - learning_intensity：学习强度（浮点数），影响最短学习间隔：最短学习间隔秒数 = 300 / learning_intensity。

- 行为要点：
  - 未配置时的默认值为：使用表达=开，学习=开，最短间隔=300 秒。
  - 学习触发还要求最近消息数达到阈值（当前实现为 25 条）。
  - learning_intensity 请使用正数；过小会导致学习很久才触发，过大则触发更频繁。
  - use_expression 仅影响“使用阶段”（选择表达并融入回复），enable_learning 仅影响“学习阶段”。

---

### 选项二：expression_groups（表达互通组）

- 作用：把多个聊天流编组为“互通组”。同一组内会在“使用阶段”共享表达库（抽样范围合并），从而让相近场景下的表达可以互相迁移复用。
- 格式：

```toml
[expression]
expression_groups = [
  ["qq:1919810:private", "qq:114514:private", "qq:1111111:group"]
]
```

- 书写规则与注意：
  - 组是“列表的列表”，每个内层列表代表一个互通组。
  - 元素必须带上类型：群聊用 `:group`，私聊用 `:private`。
  - 同一聊天可以只出现在一个互通组中；如同时出现在多个组，实际使用时将以“第一个匹配到的组”为准。
  - 互通只影响“使用阶段”的抽样与权重回写：
    - 学习阶段：数据按实际 `chat_id` 写入。
    - 使用阶段：会合并同组内各 `chat_id` 的表达进行抽样与筛选；激活后权重回写到对应来源 `chat_id`。

---

### 快速对照（来自模板与示例）

```toml
[expression]
# 表达学习配置
expression_learning = [
  ["", "enable", "enable", 1.0],
  ["qq:1919810:group", "enable", "enable", 1.5],
  ["qq:114514:private", "enable", "disable", 0.5]
]

expression_groups = [
  ["qq:1919810:private", "qq:114514:private", "qq:1111111:group"]
]
```

如需仅启用全局并关闭学习：

```toml
[expression]
expression_learning = [["", "enable", "disable", 1.0]]
```

如需完全关闭表达（全局）：

```toml
[expression]
expression_learning = [["", "disable", "disable", 1.0]]
```

以上配置即刻生效，无需改动代码。


