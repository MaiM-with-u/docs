# 🔧 配置指南

## 简介

这个配置文件主要涉及麦麦的所有行为表现
（如果你要配置哪些群可以聊天，需要到适配器设置中配置）

## 配置文件详解

```toml
[bot]
qq_account = 1145141919810
nickname = "麦麦"
alias_names = ["麦叠", "牢麦"]
```
这里配置Maibot对应的qq号和昵称，以及别名

通过昵称或别名呼叫麦麦均能引起麦麦注意。

<hr class="custom_hr"/>

```toml
[personality]
personality_core = "用一句话或几句话描述人格的核心特点" # 建议50字以内
personality_sides = [
    "用一句话或几句话描述人格的一些细节",
    "用一句话或几句话描述人格的一些细节",
    "用一句话或几句话描述人格的一些细节",
]

# 身份特点
#アイデンティティがない 生まれないらららら
[identity] 
identity_detail = [
    "身份特点",
    "身份特点",
]
```

这部分是麦麦的核心人设部分。负责描述麦麦的核心人格特点和身份特点。

- `personality_core`是麦麦人格的核心特点，建议50字以内。

- `personality_sides`是麦麦人格的一些细节描述，可以有多条。**但是不能为0哦！**

- `identity_detail`是麦麦的身份特点，可以描述外貌，性别，身高，职业，属性等等描述。同样可以有很多条，**但是不能为0哦！**

<hr class="custom_hr"/>

```toml
[expression]
# 表达方式
expression_style = "描述麦麦说话的表达风格，表达习惯"
enable_expression_learning = true # 是否启用表达学习，麦麦会学习人类说话风格
learning_interval = 600 # 学习间隔 单位秒
```

本部分配置麦麦的表达方式和学习习惯。开启后麦麦会学习人类的说话风格。

<hr class="custom_hr"/>

```toml
[chat] #麦麦的聊天通用设置
chat_mode = "normal" # 聊天模式 —— 普通模式：normal，专注模式：focus，在普通模式和专注模式之间自动切换

auto_focus_threshold = 1 # 自动切换到专注聊天的阈值，越低越容易进入专注聊天
exit_focus_threshold = 1 # 自动退出专注聊天的阈值，越低越容易退出专注聊天

[message_receive]
# 以下是消息过滤，可以根据规则过滤特定消息，将不会读取这些消息
ban_words = [
    # "403","张三"
]

ban_msgs_regex = [
    # 需要过滤的消息（原始消息）匹配的正则表达式，匹配到的消息将被过滤（支持CQ码），若不了解正则表达式请勿修改
    #"https?://[^\\s]+", # 匹配https链接
    #"\\d{4}-\\d{2}-\\d{2}", # 匹配日期
    # "\\[CQ:at,qq=\\d+\\]" # 匹配@
]
```

这部分是麦麦的聊天模式和消息过滤设置。

- `chat_mode`可以设置为`normal`（普通聊天）、`focus`（专注聊天）或者`auto`（自动切换）。这个选项决定麦麦的聊天方式。

对于`normal`模式，麦麦会使用自动的触发系统判断回复，详细的配置在`[normal_chat]`中。

对于`focus`模式，麦麦会使用大模型判断回复和使用各类插件与工具，详细的配置在`[focus_chat]`中。

- `auto_focus_threshold`和`exit_focus_threshold`分别是自动切换到专注聊天和退出专注聊天的阈值，数值越低越容易进入或退出专注聊天。
- `ban_words`是禁止的词汇列表，麦麦会过滤掉包含这些词汇的消息。
- `ban_msgs_regex`是禁止的消息正则表达式列表，麦麦会过滤掉匹配这些正则表达式的消息。

<hr class="custom_hr"/>

```toml
[normal_chat] #普通聊天
#一般回复参数
normal_chat_first_probability = 0.3 # 麦麦回答时选择首要模型的概率（与之相对的，次要模型的概率为1 - normal_chat_first_probability）
max_context_size = 15 #上下文长度
emoji_chance = 0.2 # 麦麦一般回复时使用表情包的概率，设置为1让麦麦自己决定发不发
thinking_timeout = 120 # 麦麦最长思考时间，超过这个时间的思考会放弃（往往是api反应太慢）

willing_mode = "classical" # 回复意愿模式 —— 经典模式：classical，mxp模式：mxp，自定义模式：custom（需要你自己实现）
talk_frequency = 1 # 麦麦回复频率，一般为1，默认频率下，30分钟麦麦回复30条（约数）

response_willing_amplifier = 1 # 麦麦回复意愿放大系数，一般为1
response_interested_rate_amplifier = 1 # 麦麦回复兴趣度放大系数,听到记忆里的内容时放大系数

emoji_response_penalty = 0 # 表情包回复惩罚系数，设为0为不回复单个表情包，减少单独回复表情包的概率
mentioned_bot_inevitable_reply = false # 提及 bot 必然回复
at_bot_inevitable_reply = false # @bot 必然回复

down_frequency_rate = 3 # 降低回复频率的群组回复意愿降低系数 除法
talk_frequency_down_groups = []  #降低回复频率的群号码

```

这里配置的是`normal`模式下的聊天参数。大部分可以根据注释直接配置。

<hr class="custom_hr"/>

```toml
[focus_chat] #专注聊天
think_interval = 3 # 思考间隔 单位秒，可以有效减少消耗

observation_context_size = 15 # 观察到的最长上下文大小,建议15，太短太长都会导致脑袋尖尖
compressed_length = 5 # 不能大于observation_context_size,心流上下文压缩的最短压缩长度，超过心流观察到的上下文长度，会压缩，最短压缩长度为5
compress_length_limit = 5 #最多压缩份数，超过该数值的压缩上下文会被删除

[focus_chat_processor] # 专注聊天处理器，打开可以实现更多功能，但是会增加token消耗
self_identify_processor = true # 是否启用自我识别处理器
tool_use_processor = false # 是否启用工具使用处理器
working_memory_processor = false # 是否启用工作记忆处理器
```

这部分配置的是`focus`模式下的聊天参数。

`chat_processor`是专注聊天处理器，开启后可以实现更多功能，但是会增加token消耗。
- `self_identify_processor`是自我识别处理器，开启后麦麦会尝试识别自己是谁。
- `tool_use_processor`是工具使用处理器，开启后麦麦可以使用工具。
- `working_memory_processor`是工作记忆处理器，开启后麦麦会使用工作记忆。

<hr class="custom_hr"/>

```toml
[emoji]
max_emoji_num = 40 # 表情包最大数量
max_reach_deletion = true # 开启则在达到最大数量时删除表情包，关闭则达到最大数量时不删除，只是不会继续收集表情包
check_interval = 10 # 检查表情包（注册，破损，删除）的时间间隔(分钟)
save_pic = false # 是否保存图片
save_emoji = false # 是否保存表情包
steal_emoji = true # 是否偷取表情包，让麦麦可以发送她保存的这些表情包
enable_check = false  # 是否启用表情包过滤，只有符合该要求的表情包才会被保存
check_prompt = "符合公序良俗" # 表情包过滤要求，只有符合该要求的表情包才会被保存

[memory]
build_memory_interval = 2000 # 记忆构建间隔 单位秒   间隔越低，麦麦学习越多，但是冗余信息也会增多
build_memory_distribution = [6.0,3.0,0.6,32.0,12.0,0.4] # 记忆构建分布，参数：分布1均值，标准差，权重，分布2均值，标准差，权重
build_memory_sample_num = 8 # 采样数量，数值越高记忆采样次数越多
build_memory_sample_length = 40 # 采样长度，数值越高一段记忆内容越丰富
memory_compress_rate = 0.1 # 记忆压缩率 控制记忆精简程度 建议保持默认,调高可以获得更多信息，但是冗余信息也会增多

forget_memory_interval = 1000 # 记忆遗忘间隔 单位秒   间隔越低，麦麦遗忘越频繁，记忆更精简，但更难学习
memory_forget_time = 24 #多长时间后的记忆会被遗忘 单位小时 
memory_forget_percentage = 0.01 # 记忆遗忘比例 控制记忆遗忘程度 越大遗忘越多 建议保持默认

consolidate_memory_interval = 1000 # 记忆整合间隔 单位秒   间隔越低，麦麦整合越频繁，记忆更精简
consolidation_similarity_threshold = 0.7 # 相似度阈值
consolidation_check_percentage = 0.01 # 检查节点比例

#不希望记忆的词，已经记忆的不会受到影响
memory_ban_words = [ 
    # "403","张三"
]

[mood]
mood_update_interval = 1.0 # 情绪更新间隔 单位秒
mood_decay_rate = 0.95 # 情绪衰减率
mood_intensity_factor = 1.0 # 情绪强度因子

[keywords_reaction] # 针对某个关键词作出反应
enable = true  # 关键词反应功能的总开关

[[keywords_reaction.rules]] # 如果想要新增多个关键词，直接复制本条，修改keywords和reaction即可
enable = true # 是否启用此条（为了人类在未来AI战争能更好地识别AI（bushi），默认开启）
keywords = ["人机", "bot", "机器", "入机", "robot", "机器人","ai","AI"] # 会触发反应的关键词
reaction = "有人说你是人机或者机器人，否定这一事实，攻击或反问他。注意，只有认为你是机器人才回复，否则不要否认" # 触发之后添加的提示词

[[keywords_reaction.rules]] # 就像这样复制
enable = false # 仅作示例，不会触发
keywords = ["测试关键词回复","test",""]
reaction = "回答“测试成功”"

[[keywords_reaction.rules]] # 使用正则表达式匹配句式
enable = false # 仅作示例，不会触发
regex = ["^(?P<n>\\S{1,20})是这样的$"] # 将匹配到的词汇命名为n，反应中对应的[n]会被替换为匹配到的内容，若不了解正则表达式请勿编写
reaction = "请按照以下模板造句：[n]是这样的，xx只要xx就可以，可是[n]要考虑的事情就很多了，比如什么时候xx，什么时候xx，什么时候xx。（请自由发挥替换xx部分，只需保持句式结构，同时表达一种将[n]过度重视的反讽意味）"

[chinese_typo]
enable = true # 是否启用中文错别字生成器
error_rate=0.001 # 单字替换概率
min_freq=9 # 最小字频阈值
tone_error_rate=0.1 # 声调错误概率
word_replace_rate=0.006 # 整词替换概率

[response_splitter]
enable_response_splitter = true # 是否启用回复分割器
response_max_length = 256 # 回复允许的最大长度
response_max_sentence_num = 4 # 回复允许的最大句子数
enable_kaomoji_protection = false # 是否启用颜文字保护

[remote] #发送统计信息，主要是看全球有多少只麦麦
enable = true

[experimental] #实验性功能，不一定完善或者根本不能用
enable_friend_chat = false # 是否启用好友聊天
pfc_chatting = false # 是否启用PFC聊天，该功能仅作用于私聊，与回复模式独立
```

此部分可以参考注释进行配置。

`enable_kaomoji_protection`是颜文字保护，防止在处理时将颜文字分割导致错误，如果你想让你的Bot使用颜文字，建议开启。

`pfc_chatting`是PFC聊天模式，开启后会使用一种新的判断逻辑判断是否进行聊天和聊天内容。

<hr class="custom_hr"/>

```toml
#下面的模型若使用硅基流动则不需要更改，使用ds官方则改成.env自定义的宏，使用自定义模型则选择定位相似的模型自己填写
#推理模型

# 额外字段
# 下面的模型有以下额外字段可以添加：

# stream = <true|false> : 用于指定模型是否是使用流式输出
# 如果不指定，则该项是 False

#这个模型必须是推理模型
[model.llm_reasoning] # 一般聊天模式的推理回复模型
name = "Pro/deepseek-ai/DeepSeek-R1"
provider = "SILICONFLOW"
pri_in = 1.0 #模型的输入价格（非必填，可以记录消耗）
pri_out = 4.0 #模型的输出价格（非必填，可以记录消耗）

[model.llm_normal] #V3 回复模型 专注和一般聊天模式共用的回复模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3

[model.llm_topic_judge] #主题判断模型：建议使用qwen2.5 7b
name = "Pro/Qwen/Qwen2.5-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0.35
pri_out = 0.35

[model.llm_summary] #概括模型，建议使用qwen2.5 32b 及以上
name = "Qwen/Qwen2.5-32B-Instruct"
provider = "SILICONFLOW"
pri_in = 1.26
pri_out = 1.26

[model.vlm] # 图像识别模型
name = "Pro/Qwen/Qwen2.5-VL-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0.35
pri_out = 0.35

[model.llm_heartflow] # 用于控制麦麦是否参与聊天的模型
name = "Qwen/Qwen2.5-32B-Instruct"
provider = "SILICONFLOW"
pri_in = 1.26
pri_out = 1.26

[model.llm_observation] #观察模型，压缩聊天内容，建议用免费的
# name = "Pro/Qwen/Qwen2.5-7B-Instruct"
name = "Qwen/Qwen2.5-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0

[model.llm_sub_heartflow] #心流：认真水群时,生成麦麦的内心想法，必须使用具有工具调用能力的模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8
temp = 0.3 #模型的温度，新V3建议0.1-0.3

[model.llm_plan] #决策：认真水群时,负责决定麦麦该做什么
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8

#嵌入模型

[model.embedding] #嵌入
name = "BAAI/bge-m3"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0


#私聊PFC：需要开启PFC功能，默认三个模型均为硅基流动v3，如果需要支持多人同时私聊或频繁调用，建议把其中的一个或两个换成官方v3或其它模型，以免撞到429

#PFC决策模型
[model.llm_PFC_action_planner]
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
temp = 0.3
pri_in = 2
pri_out = 8

#PFC聊天模型
[model.llm_PFC_chat]
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
temp = 0.3
pri_in = 2
pri_out = 8

#PFC检查模型
[model.llm_PFC_reply_checker]
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8

```

这部分是对使用的模型进行配置，对应模型的用途已经写在注释中。

::: warning
`llm_reasoning`必须使用推理模型。

`llm_sub_heartflow`和`llm_plan`必须使用具有工具调用能力（Function call）的模型。具体可以查询各大平台的官方文档。
:::

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
