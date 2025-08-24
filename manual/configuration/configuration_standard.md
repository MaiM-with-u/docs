# 🔧 配置指南

## 简介

这个配置文件主要涉及麦麦的所有行为表现

（如果你要配置哪些群可以聊天，需要到适配器设置中配置）

如果你要了解模型配置的内容，包括该选用哪些模型，请参考[bot_config模型配置教程](./configuration_model_standard)

## 配置文件结构

MaiBot 现在使用独立的 `bot_config.toml` 文件来配置机器人行为。配置文件包含以下主要部分：

- `[inner]` - 版本信息
- `[bot]` - 机器人基本信息
- `[personality]` - 人格设定
- `[expression]` - 表达学习配置
- `[chat]` - 聊天设置
- `[relationship]` - 关系系统
- `[message_receive]` - 消息接收过滤
- `[tool]` - 工具使用
- `[mood]` - 情绪系统
- `[emoji]` - 表情包功能
- `[memory]` - 记忆系统
- `[voice]` - 语音识别
- `[lpmm_knowledge]` - LPMM知识库
- `[keyword_reaction]` - 关键词触发
- `[custom_prompt]` - 自定义提示词
- `[response_post_process]` - 回复后处理
- `[log]` - 日志配置
- `[debug]` - 调试设置
- `[maim_message]` - Maim Message配置
- `[telemetry]` - 统计信息
- `[experimental]` - 实验性功能

## 配置文件详解

```toml
[inner]
version = "6.7.1"

#----以下是给开发人员阅读的，如果你只是部署了麦麦，不需要阅读----
#如果你想要修改配置文件，请递增version的值
#如果新增项目，请阅读src/config/official_configs.py中的说明
#
# 版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
#     主版本号：MMC版本更新
#     次版本号：配置文件内容大更新
#     修订号：配置文件内容小更新
#----以上是给开发人员阅读的，如果你只是部署了麦麦，不需要阅读----
```

<hr class="custom_hr"/>

```toml
[bot]
platform = "qq" 
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
personality_core = "是一个女孩子" 
# 人格的细节，描述人格的一些侧面
personality_side = "有时候说话不过脑子,喜欢开玩笑, 有时候会表现得无语,有时候会喜欢说一些奇怪的话"
#アイデンティティがない 生まれないらららら
# 可以描述外貌，性别，身高，职业，属性等等描述
identity = "年龄为19岁,是女孩子,身高为160cm,有黑色的短发"

# 描述麦麦说话的表达风格，表达习惯，如要修改，可以酌情新增内容
reply_style = "回复可以简短一些。可以参考贴吧，知乎和微博的回复风格，回复不要浮夸，不要用夸张修辞，平淡一些。不要浮夸，不要夸张修辞。"

# 描述麦麦的行为风格，会影响麦麦什么时候回复，什么时候使用动作，麦麦考虑的可就多了
plan_style = "当你刚刚发送了消息，没有人回复时，不要选择action，如果有别的动作（非回复）满足条件，可以选择，当你一次发送了太多消息，为了避免打扰聊天节奏，不要选择动作"

# 麦麦的兴趣，会影响麦麦对什么话题进行回复（这个配置项暂时未启用
interest = "对技术相关话题，游戏和动漫相关话题感兴趣，也对日常话题感兴趣，不喜欢太过沉重严肃的话题"
```

这部分是麦麦的核心人设部分。负责描述麦麦的核心人格特点和身份特点。

- `personality_core`: 人格核心特质，建议50字以内
- `personality_side`: 人格细节描述
- `identity`: 外貌、性别、身高、职业等身份描述
- `reply_style`: 说话的表达风格和习惯
- `plan_style`: 行为风格，影响麦麦的回复和动作选择
- `interest`: 兴趣偏好，影响麦麦对话题的回复倾向

<hr class="custom_hr"/>

```toml
[expression]
# 表达学习配置
learning_list = [ # 表达学习配置列表，支持按聊天流配置
    ["", "enable", "enable", "1.0"],  # 全局配置：使用表达，启用学习，学习强度1.0
    ["qq:1919810:group", "enable", "enable", "1.5"],  # 特定群聊配置：使用表达，启用学习，学习强度1.5
    ["qq:114514:private", "enable", "disable", "0.5"],  # 特定私聊配置：使用表达，禁用学习，学习强度0.5
    # 格式说明：
    # 第一位: chat_stream_id，空字符串表示全局配置
    # 第二位: 是否使用学到的表达 ("enable"/"disable")
    # 第三位: 是否学习表达 ("enable"/"disable") 
    # 第四位: 学习强度（浮点数），影响学习频率，最短学习时间间隔 = 300/学习强度（秒）
    # 学习强度越高，学习越频繁；学习强度越低，学习越少
]

expression_groups = [
    ["qq:1919810:private","qq:114514:private","qq:1111111:group"], # 在这里设置互通组，相同组的chat_id会共享学习到的表达方式
    # 格式：["qq:123456:private","qq:654321:group"]
    # 注意：如果为群聊，则需要设置为group，如果设置为私聊，则需要设置为private
]
```

- `learning_list` 支持按聊天流配置表达学习，可以针对不同的群聊或私聊设置不同的学习策略
- `expression_groups` 可以设置互通组，让麦麦在不同的聊天中共享学习到的表达方式

<hr class="custom_hr"/>

```toml
[relationship]
enable_relationship = true # 是否启用关系系统
relation_frequency = 1 # 关系频率，麦麦构建关系的频率
```
- `enable_relationship` 开启后，麦麦会开始构建并记忆与其他人的关系。

<hr class="custom_hr"/>

```toml
[chat] #麦麦的聊天设置
talk_frequency = 0.5
# 麦麦活跃度，越高，麦麦回复越多，范围0-1
focus_value = 0.5 
# 麦麦的专注度，越高越容易持续连续对话，可能消耗更多token, 范围0-1

max_context_size = 20 # 上下文长度

interest_rate_mode = "fast" #激活值计算模式，可选fast或者accurate

planner_size = 2.5 # 副规划器大小，越小，麦麦的动作执行能力越精细，但是消耗更多token，调大可以缓解429类错误

mentioned_bot_inevitable_reply = true # 提及 bot 大概率回复
at_bot_inevitable_reply = true # @bot 或 提及bot 大概率回复

focus_value_adjust = [
    ["", "8:00,1", "12:00,0.8", "18:00,1", "01:00,0.3"],
    ["qq:114514:group", "12:20,0.6", "16:10,0.5", "20:10,0.8", "00:10,0.3"],
    ["qq:1919810:private", "8:20,0.5", "12:10,0.8", "20:10,1", "00:10,0.2"]
]

talk_frequency_adjust = [
    ["", "8:00,0.5", "12:00,0.6", "18:00,0.8", "01:00,0.3"],
    ["qq:114514:group", "12:20,0.3", "16:10,0.5", "20:10,0.4", "00:10,0.1"],
    ["qq:1919810:private", "8:20,0.3", "12:10,0.4", "20:10,0.5", "00:10,0.1"]
]
# 基于聊天流的个性化活跃度和专注度配置
# 格式：[["platform:chat_id:type", "HH:MM,frequency", "HH:MM,frequency", ...], ...]

# 全局配置示例：
# [["", "8:00,1", "12:00,2", "18:00,1.5", "00:00,0.5"]]

# 特定聊天流配置示例：
# [
#     ["", "8:00,1", "12:00,1.2", "18:00,1.5", "01:00,0.6"],  # 全局默认配置
#     ["qq:1026294844:group", "12:20,1", "16:10,2", "20:10,1", "00:10,0.3"],  # 特定群聊配置
#     ["qq:729957033:private", "8:20,1", "12:10,2", "20:10,1.5", "00:10,0.2"]  # 特定私聊配置
# ]

# 说明：
# - 当第一个元素为空字符串""时，表示全局默认配置
# - 当第一个元素为"platform:id:type"格式时，表示特定聊天流配置
# - 后续元素是"时间,频率"格式，表示从该时间开始使用该活跃度，直到下一个时间点
# - 优先级：特定聊天流配置 > 全局配置 > 默认 talk_frequency
```

这部分是麦麦的聊天设置。
- `talk_frequency` 是全局回复频率，范围0-1
- `focus_value` 是专注度，影响连续对话能力
- `max_context_size` 控制上下文长度
- `interest_rate_mode` 控制激活值计算模式，可选"fast"或"accurate"
- `planner_size` 控制副规划器大小，调大可以缓解429类错误
- `focus_value_adjust` 和 `talk_frequency_adjust` 支持基于聊天流和时间段的个性化配置

<hr class="custom_hr"/>

```toml
[message_receive]
# 以下是消息过滤，可以根据规则过滤特定消息，将不会读取这些消息
ban_words = [
    # "403","张三"
    ]

ban_msgs_regex = [
    # 需要过滤的消息（原始消息）匹配的正则表达式，匹配到的消息将被过滤，若不了解正则表达式请勿修改
    #"https?://[^\\s]+", # 匹配https链接
    #"\\d{4}-\\d{2}-\\d{2}", # 匹配日期
]
```
- `ban_words` 是关键词黑名单，包含这些词的消息会被过滤。
- `ban_msgs_regex` 是正则表达式黑名单，匹配到的消息会被过滤。

<hr class="custom_hr"/>

```toml
[tool]
enable_tool = false # 是否在普通聊天中启用工具
```

- `enable_tool` 控制是否在普通聊天中启用工具功能

<hr class="custom_hr"/>

```toml
[mood]
enable_mood = true # 是否启用情绪系统
mood_update_threshold = 1 # 情绪更新阈值,越高，更新越慢
```

- `enable_mood` 控制是否启用情绪系统
- `mood_update_threshold` 控制情绪更新频率

<hr class="custom_hr"/>

```toml
[emoji]
emoji_chance = 0.6 # 麦麦激活表情包动作的概率

max_reg_num = 100 # 表情包最大注册数量
do_replace = true # 开启则在达到最大数量时删除（替换）表情包，关闭则达到最大数量时不会继续收集表情包
check_interval = 10 # 检查表情包（注册，破损，删除）的时间间隔(分钟)
steal_emoji = true # 是否偷取表情包，让麦麦可以将一些表情包据为己有
content_filtration = false  # 是否启用表情包过滤，只有符合该要求的表情包才会被保存
filtration_prompt = "符合公序良俗" # 表情包过滤要求，只有符合该要求的表情包才会被保存
```

此部分用于配置表情包相关功能。

<hr class="custom_hr"/>

```toml
[memory]
enable_memory = true # 是否启用记忆系统
memory_build_frequency = 1 # 记忆构建频率 越高，麦麦学习越多
memory_compress_rate = 0.1 # 记忆压缩率 控制记忆精简程度 建议保持默认,调高可以获得更多信息，但是冗余信息也会增多

forget_memory_interval = 3000 # 记忆遗忘间隔 单位秒   间隔越低，麦麦遗忘越频繁，记忆更精简，但更难学习
memory_forget_time = 48 #多长时间后的记忆会被遗忘 单位小时
memory_forget_percentage = 0.008 # 记忆遗忘比例 控制记忆遗忘程度 越大遗忘越多 建议保持默认

enable_instant_memory = false # 是否启用即时记忆，测试功能，可能存在未知问题

#不希望记忆的词，已经记忆的不会受到影响，需要手动清理
memory_ban_words = [ "表情包", "图片", "回复", "聊天记录" ]
```

此部分用于配置麦麦的记忆系统。

<hr class="custom_hr"/>

```toml
[voice]
enable_asr = false # 是否启用语音识别，启用后麦麦可以识别语音消息，启用该功能需要配置语音识别模型[model.voice]s
```

- `enable_asr` 控制是否启用语音识别功能

<hr class="custom_hr"/>

```toml
[lpmm_knowledge] # lpmm知识库配置
enable = false # 是否启用lpmm知识库
rag_synonym_search_top_k = 10 # 同义词搜索TopK
rag_synonym_threshold = 0.8 # 同义词阈值（相似度高于此阈值的词语会被认为是同义词）
info_extraction_workers = 3 # 实体提取同时执行线程数，非Pro模型不要设置超过5
qa_relation_search_top_k = 10 # 关系搜索TopK
qa_relation_threshold = 0.5 # 关系阈值（相似度高于此阈值的关系会被认为是相关的关系）
qa_paragraph_search_top_k = 1000 # 段落搜索TopK（不能过小，可能影响搜索结果）
qa_paragraph_node_weight = 0.05 # 段落节点权重（在图搜索&PPR计算中的权重，当搜索仅使用DPR时，此参数不起作用）
qa_ent_filter_top_k = 10 # 实体过滤TopK
qa_ppr_damping = 0.8 # PPR阻尼系数
qa_res_top_k = 3 # 最终提供的文段TopK
embedding_dimension = 1024 # 嵌入向量维度,应该与模型的输出维度一致
```

此部分用于配置 LPMM 知识库。

<hr class="custom_hr"/>

```toml
[keyword_reaction]
keyword_rules = [
    { keywords = ["人机", "bot", "机器", "入机", "robot", "机器人", "ai", "AI"], reaction = "有人说你是人机或者机器人，否定这一事实，攻击或反问他。注意，只有认为你是机器人才回复，否则不要否认" },
    { keywords = ["测试关键词回复", "test"], reaction = "回答测试成功" },
    #{ keywords = ["你好", "hello"], reaction = "你好，有什么可以帮你？" }    
    # 在此处添加更多规则，格式同上
]

regex_rules = [
    { regex = ["^(?P<n>\\S{1,20})是这样的$"], reaction = "请按照以下模板造句：[n]是这样的，xx只要xx就可以，可是[n]要考虑的事情就很多了，比如什么时候xx，什么时候xx，什么时候xx。（请自由发挥替换xx部分，只需保持句式结构，同时表达一种将[n]过度重视的反讽意味）" }
]
```

- `keyword_rules` 用于设置关键词触发的额外回复知识。
- `regex_rules` 用于设置正则表达式触发的额外回复知识。

<hr class="custom_hr"/>

```toml
[custom_prompt]
image_prompt = "请用中文描述这张图片的内容。如果有文字，请把文字描述概括出来，请留意其主题，直观感受，输出为一段平文本，最多30字，请注意不要分点，就输出一段文本"
```

- `image_prompt` 可以自定义图像识别的提示词

<hr class="custom_hr"/>

```toml
[response_post_process]
enable_response_post_process = true # 是否启用回复后处理，包括错别字生成器，回复分割器

[chinese_typo]
enable = true # 是否启用中文错别字生成器
error_rate=0.01 # 单字替换概率
min_freq=9 # 最小字频阈值
tone_error_rate=0.1 # 声调错误概率
word_replace_rate=0.006 # 整词替换概率

[response_splitter]
enable = true # 是否启用回复分割器
max_length = 512 # 回复允许的最大长度
max_sentence_num = 8 # 回复允许的最大句子数
enable_kaomoji_protection = false # 是否启用颜文字保护
```

此部分可以对模型的回复进行二次处理。

<hr class="custom_hr"/>

```toml
[log]
date_style = "m-d H:i:s" # 日期格式
log_level_style = "lite" # 日志级别样式,可选FULL，compact，lite
color_text = "full" # 日志文本颜色，可选none，title，full
log_level = "INFO" # 全局日志级别（向下兼容，优先级低于下面的分别设置）
console_log_level = "INFO" # 控制台日志级别，可选: DEBUG, INFO, WARNING, ERROR, CRITICAL
file_log_level = "DEBUG" # 文件日志级别，可选: DEBUG, INFO, WARNING, ERROR, CRITICAL

# 第三方库日志控制
suppress_libraries = ["faiss","httpx", "urllib3", "asyncio", "websockets", "httpcore", "requests", "peewee", "openai","uvicorn","jieba"] # 完全屏蔽的库
library_log_levels = { "aiohttp" = "WARNING"} # 设置特定库的日志级别
```

此部分用于配置日志系统。

<hr class="custom_hr"/>

```toml
[debug]
show_prompt = false # 是否显示prompt
```

- `show_prompt` 控制是否在调试时显示提示词

<hr class="custom_hr"/>

```toml
[maim_message]
auth_token = [] # 认证令牌，用于API验证，为空则不启用验证
# 以下项目若要使用需要打开use_custom，并单独配置maim_message的服务器
use_custom = false # 是否启用自定义的maim_message服务器，注意这需要设置新的端口，不能与.env重复
host="127.0.0.1"
port=8090
mode="ws" # 支持ws和tcp两种模式
use_wss = false # 是否使用WSS安全连接，只支持ws模式
cert_file = "" # SSL证书文件路径，仅在use_wss=true时有效
key_file = "" # SSL密钥文件路径，仅在use_wss=true时有效
```

高级设置，通常无需修改。

<hr class="custom_hr"/>

```toml
[telemetry] #发送统计信息，主要是看全球有多少只麦麦
enable = true

[experimental] #实验性功能
enable_friend_chat = false # 是否启用好友聊天
```

- `telemetry` 控制是否发送统计信息
- `experimental` 包含实验性功能开关

## 注意事项

1. **API密钥安全**：
    - 妥善保管API密钥
    - 不要将含有密钥的配置文件上传至公开仓库

2. **配置修改**：
    - 修改配置后需重启服务
    - 模型配置现在在独立的 `model_config.toml` 文件中
    - QQ号和群号使用数字格式(机器人QQ号除外)
    - **配置文件版本号需要递增**

3. **其他说明**：
    - 项目处于测试阶段，可能存在未知问题
    - 建议初次使用保持默认配置
    - 配置文件现在分为两个：`bot_config.toml` 和 `model_config.toml`

4. **错误排查**：
    - 配置错误：检查配置文件语法是否正确
    - 功能异常：确认相关功能开关是否启用
    - 模型问题：检查 `model_config.toml` 中的模型配置