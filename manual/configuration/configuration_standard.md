# 🔧 配置指南

## 简介

这个配置文件主要涉及麦麦的所有行为表现

（如果你要配置哪些群可以聊天，需要到适配器设置中配置）

如果你要了解模型配置的内容，包括该选用哪些模型，请参考[bot_config模型配置教程](./configuration_model_standard)

## 配置文件详解

```toml
[bot]
qq_account = 1145141919810 # 麦麦的QQ账号
nickname = "麦麦" # 麦麦的昵称
alias_names = ["麦叠", "牢麦"] # 麦麦的别名
```
这里配置Maibot对应的qq号和昵称，以及别名

通过昵称或别名呼叫麦麦均能引起麦麦注意。
如果不配置将无法正常识别at和呼叫

<hr class="custom_hr"/>

```toml
[personality]
# 建议50字以内，描述人格的核心特质
personality_core = "是一个积极向上的女大学生" 
# 人格的细节，可以描述人格的一些侧面，条数任意，不能为0，不宜太多
personality_sides = [
    "用一句话或几句话描述人格的一些侧面",
    "用一句话或几句话描述人格的一些侧面",
    "用一句话或几句话描述人格的一些侧面",
]

compress_personality = false # 是否压缩人格，压缩后会精简人格信息

[identity]
#アイデンティティがない 生まれないらららら
# 可以描述外貌，性别，身高，职业，属性等等描述,条数任意，不能为0
identity_detail = [
    "年龄为19岁",
    "是女孩子",
]

compress_indentity = true # 是否压缩身份，压缩后会精简身份信息
```

这部分是麦麦的核心人设部分。负责描述麦麦的核心人格特点和身份特点。

- `compress_personality` 和 `compress_indentity` 分别控制是否压缩人格和身份信息，以节省token消耗并提高回复性能。如果人设不长，可以关闭。

<hr class="custom_hr"/>

```toml
[expression]
# 表达方式
expression_style = "描述麦麦说话的表达风格，表达习惯"
enable_expression_learning = false # 是否启用表达学习，麦麦会学习不同群里人类说话风格（群之间不互通）
learning_interval = 600 # 学习间隔 单位秒

expression_groups = [
    ["qq:1919810:private","qq:114514:private","qq:1111111:group"], # 在这里设置互通组，相同组的chat_id会共享学习到的表达方式
]
```

- `expression_style`会影响麦麦的说话风格。
- `enable_expression_learning`开启后麦麦会学习群友的说话风格。
- `expression_groups`可以设置互通组，让麦麦在不同的聊天中共享学习到的表达方式。

<hr class="custom_hr"/>

```toml
[relationship]
enable_relationship = true # 是否启用关系系统
relation_frequency = 1 # 关系频率，麦麦构建关系的速度，仅在normal_chat模式下有效
```
- `enable_relationship` 开启后，麦麦会开始构建并记忆与其他人的关系。

<hr class="custom_hr"/>

```toml
[chat] #麦麦的聊天通用设置
chat_mode = "normal" # 聊天模式 —— 普通模式：normal，专注模式：focus，在普通模式和专注模式之间自动切换
talk_frequency = 1 # 麦麦回复频率，越高，麦麦回复越频繁

time_based_talk_frequency = ["8:00,1", "12:00,1.5", "18:00,2", "01:00,0.5"]
talk_frequency_adjust = [
    ["qq:114514:group", "12:20,1", "16:10,2", "20:10,1", "00:10,0.3"],
]

auto_focus_threshold = 1 # 自动切换到专注聊天的阈值，越低越容易进入专注聊天
exit_focus_threshold = 1 # 自动退出专注聊天的阈值，越低越容易退出专注聊天
```
这部分是麦麦的聊天模式和频率设置。
- `chat_mode`可以设置为`normal`（普通聊天）、`focus`（专注聊天）或者`auto`（自动切换）。
- `talk_frequency`是全局回复频率。
- `time_based_talk_frequency`可以根据时间段设置不同的回复频率。
- `talk_frequency_adjust`可以为特定的群聊或私聊设置独立的时间段回复频率，优先级最高。

<hr class="custom_hr"/>

```toml
[message_receive]
ban_words = ["403","张三"]
ban_msgs_regex = ["https?://[^\\s]+"]
```
- `ban_words`是关键词黑名单，包含这些词的消息会被过滤。
- `ban_msgs_regex`是正则表达式黑名单，匹配到的消息会被过滤。

<hr class="custom_hr"/>

```toml
[normal_chat] #普通聊天
normal_chat_first_probability = 0.5 # 麦麦回答时选择首要模型的概率
max_context_size = 15 #上下文长度
emoji_chance = 0.2 # 使用表情包的概率
thinking_timeout = 120 # 最长思考时间

willing_mode = "classical" # 回复意愿模式
response_interested_rate_amplifier = 1 # 麦麦回复兴趣度放大系数
emoji_response_penalty = 0 # 对其他人发的表情包回复惩罚系数
mentioned_bot_inevitable_reply = true # 提及 bot 必然回复
at_bot_inevitable_reply = true # @bot 必然回复
enable_planner = false # 是否启用动作规划器（实验性功能）
```

这里配置的是`normal`模式下的聊天参数。大部分可以根据注释直接配置。

<hr class="custom_hr"/>

```toml
[focus_chat] #专注聊天
think_interval = 3 # 思考间隔 单位秒
consecutive_replies = 1 # 连续回复能力
processor_max_time = 20 # 处理器最大时间
observation_context_size = 20 # 观察到的最长上下文大小
compressed_length = 8 # 心流上下文压缩的最短压缩长度
compress_length_limit = 4 #最多压缩份数
```
这部分配置的是`focus`模式下的聊天参数。

<hr class="custom_hr"/>

```toml
[focus_chat_processor] # 专注聊天处理器
person_impression_processor = true # 是否启用关系识别处理器
tool_use_processor = false # 是否启用工具使用处理器
working_memory_processor = false # 是否启用工作记忆处理器，消耗量大
expression_selector_processor = true # 是否启用表达方式选择处理器
```
`chat_processor`是专注聊天处理器，开启后可以实现更多功能，但是会增加token消耗。

<hr class="custom_hr"/>

```toml
[emoji]
max_reg_num = 60 # 表情包最大注册数量
do_replace = true # 达到最大数量时是否替换
check_interval = 10 # 检查表情包的时间间隔(分钟)
steal_emoji = true # 是否偷取表情包
content_filtration = false  # 是否启用表情包内容过滤
filtration_prompt = "符合公序良俗" # 表情包过滤要求
```
此部分用于配置表情包相关功能。

<hr class="custom_hr"/>

```toml
[memory]
enable_memory = true # 是否启用记忆系统
memory_build_interval = 1000 # 记忆构建间隔 单位秒
memory_build_distribution = [6.0, 3.0, 0.6, 32.0, 12.0, 0.4]
memory_build_sample_num = 4 # 采样数量
memory_build_sample_length = 30 # 采样长度
memory_compress_rate = 0.1 # 记忆压缩率

forget_memory_interval = 1500 # 记忆遗忘间隔 单位秒
memory_forget_time = 24 #多长时间后的记忆会被遗忘 单位小时
memory_forget_percentage = 0.01 # 记忆遗忘比例

consolidate_memory_interval = 1000 # 记忆整合间隔 单位秒
consolidation_similarity_threshold = 0.7 # 相似度阈值
consolidation_check_percentage = 0.05 # 检查节点比例

memory_ban_words = [ "表情包", "图片", "回复", "聊天记录" ]
```
此部分用于配置麦麦的记忆系统。

<hr class="custom_hr"/>

```toml
[mood] # 仅在 普通聊天 有效
mood_update_interval = 1.0 # 情绪更新间隔 单位秒
mood_decay_rate = 0.95 # 情绪衰减率
mood_intensity_factor = 1.0 # 情绪强度因子
```
此部分用于配置麦麦的情绪系统。

<hr class="custom_hr"/>

```toml
[lpmm_knowledge] # lpmm知识库配置
enable = true # 是否启用lpmm知识库
rag_synonym_search_top_k = 10 # 同义词搜索TopK
rag_synonym_threshold = 0.8 # 同义词阈值
info_extraction_workers = 3 # 实体提取同时执行线程数
qa_relation_search_top_k = 10 # 关系搜索TopK
qa_relation_threshold = 0.5 # 关系阈值
qa_paragraph_search_top_k = 1000 # 段落搜索TopK
qa_paragraph_node_weight = 0.05 # 段落节点权重
qa_ent_filter_top_k = 10 # 实体过滤TopK
qa_ppr_damping = 0.8 # PPR阻尼系数
qa_res_top_k = 3 # 最终提供的文段TopK
```
此部分用于配置 LPMM 知识库。

<hr class="custom_hr"/>

```toml
[keyword_reaction]
keyword_rules = [
    { keywords = ["人机", "bot"], reaction = "有人说你是人机或者机器人，否定这一事实" },
    { keywords = ["测试关键词回复", "test"], reaction = "回答测试成功" },
]

[regex_rules]
regex_rules = [
    { regex = ["^(?P<n>\\S{1,20})是这样的$"], reaction = "请按照以下模板造句：[n]是这样的..." }
]
```
- `keyword_rules` 用于设置关键词触发的额外回复知识。
- `regex_rules` 用于设置正则表达式触发的额外回复知识。

<hr class="custom_hr"/>

```toml
[response_post_process]
enable_response_post_process = true # 是否启用回复后处理

[chinese_typo]
enable = true # 是否启用中文错别字生成器
error_rate=0.01
min_freq=9
tone_error_rate=0.1
word_replace_rate=0.006

[response_splitter]
enable = true # 是否启用回复分割器
max_length = 512 # 回复允许的最大长度
max_sentence_num = 8 # 回复允许的最大句子数
enable_kaomoji_protection = false # 是否启用颜文字保护
```
此部分可以对模型的回复进行二次处理。

<hr class="custom_hr"/>

```toml
[maim_message]
auth_token = [] # 认证令牌
use_custom = false # 是否启用自定义的maim_message服务器
host="127.0.0.1"
port=8090
mode="ws"
use_wss = false
cert_file = ""
key_file = ""

[telemetry] #发送统计信息
enable = true

[experimental] #实验性功能
debug_show_chat_mode = false # 是否在回复后显示当前聊天模式
enable_friend_chat = false # 是否启用好友聊天
```
高级设置，通常无需修改。

<hr class="custom_hr"/>

## 注意事项

1. API密钥安全：
    - 妙善保管API密钥
    - 不要将含有密钥的配置文件上传至公开仓库

2. 配置修改：
    - 修改配置后需重启服务
    - 使用默认服务(硅基流动)时无需修改模型配置
    - QQ号和群号使用数字格式(机器人QQ号除外)
    - **模型名称可能更新，需定期检查控制台模型名**

3. 其他说明：
    - 项目处于测试阶段，可能存在未知问题
    - 建议初次使用保持默认配置

4. 错误排查：
    - `401` 错误：检查 `ALIYUNCS_KEY` 是否有效
    - `404` 错误：确认 `ALIYUNCS_BASE_URL` 路径正确
    - 超时错误：检查网络配置是否允许访问阿里云API域名
