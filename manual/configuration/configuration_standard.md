# 🔧 配置指南

## 简介

本项目需要配置两个主要文件：

1. `.env` - 配置API服务和系统环境
2. `bot_config.toml` - 配置机器人行为和模型

## API配置说明

`.env` 和 `bot_config.toml` 中的API配置关系如下：

### 在.env中定义API凭证

```ini
# API凭证配置
SILICONFLOW_KEY=your_key        # 硅基流动API密钥
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/  # 硅基流动API地址
DEEP_SEEK_KEY=your_key          # DeepSeek API密钥
DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1  # DeepSeek API地址
```

### 在bot_config.toml中引用API凭证

```toml
[model.llm_reasoning]
name = "Pro/deepseek-ai/DeepSeek-R1"
provider = "SILICONFLOW"         # 引用.env.prod中定义的宏
```

如需切换到其他API服务，只需修改引用：

```toml
[model.llm_reasoning]
name = "deepseek-reasoner"       # 改成对应的模型名称，这里为DeepseekR1
provider = "DEEP_SEEK"           # 使用DeepSeek provider
```

## 配置文件详解

### 环境配置文件 (.env.prod)

```ini
HOST=127.0.0.1
PORT=8000
```
这部分负责配置MaiBot监听的端口和地址

<hr class="custom_hr"/>

```ini
# 默认配置
# 如果工作在Docker下，请改成 MONGODB_HOST=mongodb
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
DATABASE_NAME=MegBot

# 也可以使用 URI 连接数据库（优先级比上面的高）
# MONGODB_URI=mongodb://127.0.0.1:27017/MegBot

# MongoDB 认证信息，若需要认证，请取消注释以下三行并填写正确的信息
# MONGODB_USERNAME=user
# MONGODB_PASSWORD=password
# MONGODB_AUTH_SOURCE=admin
```
这部分负责配置MaiBot所连接的MongoDB服务

`MONGODB_HOST`为MongoDB服务的主机地址

`MONGODB_PORT`为MongoDB服务的监听端口

`DATABASE_NAME`为MongoDB中MaiBot所使用的数据库名字，如果没有，MaiBot会自动创建

支持使用MongoURI，需要取消注释并修改`MONGODB_URI`

如果需要认证，取消注释并设置`MONGODB_USERNAME`，`MONGODB_PASSWORD`和`MONGODB_AUTH_SOURCE`

<hr class="custom_hr"/>

```ini
#key and url
CHAT_ANY_WHERE_BASE_URL=https://api.chatanywhere.tech/v1
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/
DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1

# 定义你要用的api的key(需要去对应网站申请哦)
DEEP_SEEK_KEY=
CHAT_ANY_WHERE_KEY=
SILICONFLOW_KEY=

```
这部分配置MaiBot使用的API以及API_key

支持自定义宏，对应的BASE_URL和KEY的前缀应该相同

比如，`DEEP_SEEK`的`BASE_URL`为`DEEP_SEEK_BASE_URL`，`KEY`为`DEEP_SEEK_KEY`

### 机器人配置文件 (bot_config.toml)

```toml
[bot]
qq = 114514
nickname = "麦麦"
alias_names = ["麦叠", "牢麦"]
```
这里配置Maibot对应的qq号和昵称，以及别名

通过昵称或别名呼叫麦麦均能引起麦麦注意

<hr class="custom_hr"/>

```toml
[groups]
talk_allowed = [
    123,
    123,
]  #可以回复消息的群号码
talk_frequency_down = []  #降低回复频率的群号码
ban_user_id = []  #禁止回复和读取消息的QQ号
```
这里配置允许说话的群聊，以及其他群设置，参见注释

<hr class="custom_hr"/>

```toml
[personality] #未完善
personality_core = "用一句话或几句话描述人格的核心特点" # 建议20字以内，谁再写3000字小作文敲谁脑袋
personality_sides = [
    "用一句话或几句话描述人格的一些细节",
    "用一句话或几句话描述人格的一些细节",
    "用一句话或几句话描述人格的一些细节",
    "用一句话或几句话描述人格的一些细节",
    "用一句话或几句话描述人格的一些细节",
]# 条数任意

[identity] #アイデンティティがない 生まれないらららら
# 兴趣爱好 未完善，有些条目未使用
identity_detail = [
    "身份特点",
    "身份特点",
]# 条数任意
#外貌特征
height = 170 # 身高 单位厘米
weight = 50 # 体重 单位千克
age = 20 # 年龄 单位岁
gender = "男" # 性别
appearance = "用几句话描述外貌特征" # 外貌特征

[schedule]
enable_schedule_gen = true # 是否启用日程表(尚未完成)
prompt_schedule_gen = "用几句话描述描述性格特点或行动规律，这个特征会用来生成日程表"
schedule_doing_update_interval = 900 # 日程表更新间隔 单位秒
schedule_temperature = 0.2 # 日程表温度，建议0.2-0.5
time_zone = "Asia/Shanghai" # 给你的机器人设置时区，可以解决运行电脑时区和国内时区不同的情况，或者模拟国外留学生日程
```

以上部分是有关麦麦的设定，可以参考注释进行设置

<hr class="custom_hr"/>

```toml
[platforms] # 必填项目，填写每个平台适配器提供的链接
nonebot-qq="http://127.0.0.1:18002/api/message"
```

这里是给旧版的adapter兼容，以后可能会更改。

<hr class="custom_hr"/>

```toml
[response] #使用哪种回复策略
response_mode = "heart_flow" # 回复策略，可选值：heart_flow（心流），reasoning（推理）

#推理回复参数
model_r1_probability = 0.7 # 麦麦回答时选择主要回复模型1 模型的概率
model_v3_probability = 0.3 # 麦麦回答时选择次要回复模型2 模型的概率

[heartflow] # 注意：可能会消耗大量token，请谨慎开启，仅会使用v3模型
sub_heart_flow_update_interval = 60 # 子心流更新频率，间隔 单位秒
sub_heart_flow_freeze_time = 100 # 子心流冻结时间，超过这个时间没有回复，子心流会冻结，间隔 单位秒
sub_heart_flow_stop_time = 500 # 子心流停止时间，超过这个时间没有回复，子心流会停止，间隔 单位秒
heart_flow_update_interval = 300 # 心流更新频率，间隔 单位秒

```

心流相关设置，配置麦麦脑内思考内容的频率，使用的模型等

其中的主要回复模型和次要回复模型对应下面的主次模型配置

<hr class="custom_hr"/>

```toml
[message]
max_context_size = 12 # 麦麦获得的上文数量，建议12，太短太长都会导致脑袋尖尖
emoji_chance = 0.2 # 麦麦使用表情包的概率
thinking_timeout = 60 # 麦麦最长思考时间，超过这个时间的思考会放弃
max_response_length = 256 # 麦麦回答的最大token数
message_buffer = true # 启用消息缓冲器？启用此项以解决消息的拆分问题，但会使麦麦的回复延迟
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

配置麦麦收发相关内容

消息缓冲器是为了解决麦麦接收分条发送的消息后过快进入思考，导致回复答非所问的问题，但是会导致回复略有延迟

<hr class="custom_hr"/>

```toml
[willing]
willing_mode = "classical" # 回复意愿模式 经典模式
# willing_mode = "dynamic" # 动态模式(不兼容，需要维护)
# willing_mode = "custom" # 自定义模式（可自行调整
response_willing_amplifier = 1 # 麦麦回复意愿放大系数，一般为1
response_interested_rate_amplifier = 1 # 麦麦回复兴趣度放大系数,听到记忆里的内容时放大系数
down_frequency_rate = 3 # 降低回复频率的群组回复意愿降低系数 除法
emoji_response_penalty = 0.1 # 表情包回复惩罚系数，设为0为不回复单个表情包，减少单独回复表情包的概率
mentioned_bot_inevitable_reply = false # 提及 bot 必然回复
at_bot_inevitable_reply = false # @bot 必然回复
```

麦麦回复的意愿计算方法配置与参数

<hr class="custom_hr"/>

```toml
[emoji]
max_emoji_num = 120 # 表情包最大数量
max_reach_deletion = true # 开启则在达到最大数量时删除表情包，关闭则达到最大数量时不删除，只是不会继续收集表情包
check_interval = 30 # 检查表情包（注册，破损，删除）的时间间隔(分钟)
auto_save = true  # 是否保存表情包和图片
enable_check = false  # 是否启用表情包过滤
check_prompt = "符合公序良俗" # 表情包过滤要求

[memory]
build_memory_interval = 2000 # 记忆构建间隔 单位秒   间隔越低，麦麦学习越多，但是冗余信息也会增多
build_memory_distribution = [4.0,2.0,0.6,24.0,8.0,0.4] # 记忆构建分布，参数：分布1均值，标准差，权重，分布2均值，标准差，权重
build_memory_sample_num = 10 # 采样数量，数值越高记忆采样次数越多
build_memory_sample_length = 20 # 采样长度，数值越高一段记忆内容越丰富
memory_compress_rate = 0.1 # 记忆压缩率 控制记忆精简程度 建议保持默认,调高可以获得更多信息，但是冗余信息也会增多

forget_memory_interval = 1000 # 记忆遗忘间隔 单位秒   间隔越低，麦麦遗忘越频繁，记忆更精简，但更难学习
memory_forget_time = 24 #多长时间后的记忆会被遗忘 单位小时 
memory_forget_percentage = 0.01 # 记忆遗忘比例 控制记忆遗忘程度 越大遗忘越多 建议保持默认

memory_ban_words = [ #不希望记忆的词
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

[response_spliter]
enable_response_spliter = true # 是否启用回复分割器
response_max_length = 100 # 回复允许的最大长度
response_max_sentence_num = 4 # 回复允许的最大句子数

[remote] #发送统计信息，主要是看全球有多少只麦麦
enable = true

[experimental] #实验性功能，不一定完善或者根本不能用
enable_friend_chat = false # 是否启用好友聊天
pfc_chatting = false # 是否启用PFC聊天，该功能仅作用于私聊，与回复模式独立
```

此部分可以参考注释进行配置

<hr class="custom_hr"/>

```toml
#下面的模型若使用硅基流动则不需要更改，使用ds官方则改成.env自定义的宏，使用自定义模型则选择定位相似的模型自己填写
#推理模型

# 额外字段
# 下面的模型有以下额外字段可以添加：

# stream = <true|false> : 用于指定模型是否是使用流式输出
# 如果不指定，则该项是 False

[model.llm_reasoning] #只在回复模式为reasoning时启用
name = "Pro/deepseek-ai/DeepSeek-R1"
# name = "Qwen/QwQ-32B"
provider = "SILICONFLOW"
pri_in = 4 #模型的输入价格（非必填，可以记录消耗）
pri_out = 16 #模型的输出价格（非必填，可以记录消耗）

#非推理模型

[model.llm_normal] #V3 回复模型1 主要回复模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）

[model.llm_emotion_judge] #表情包判断 
name = "Qwen/Qwen2.5-14B-Instruct"
provider = "SILICONFLOW"
pri_in = 0.7
pri_out = 0.7

[model.llm_topic_judge] #记忆主题判断：建议使用qwen2.5 7b
name = "Pro/Qwen/Qwen2.5-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0

[model.llm_summary_by_topic] #概括模型，建议使用qwen2.5 32b 及以上
name = "Qwen/Qwen2.5-32B-Instruct"
provider = "SILICONFLOW"
pri_in = 1.26
pri_out = 1.26

[model.moderation] #内容审核，开发中
name = ""
provider = "SILICONFLOW"
pri_in = 1.0
pri_out = 2.0

# 识图模型

[model.vlm] #图像识别 
name = "Pro/Qwen/Qwen2.5-VL-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0.35
pri_out = 0.35

#嵌入模型

[model.embedding] #嵌入
name = "BAAI/bge-m3"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0

[model.llm_observation] #观察模型，建议用免费的：建议使用qwen2.5 7b
# name = "Pro/Qwen/Qwen2.5-7B-Instruct"
name = "Qwen/Qwen2.5-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0

[model.llm_sub_heartflow] #子心流：建议使用V3级别
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8

[model.llm_heartflow] #心流：建议使用qwen2.5 32b
# name = "Pro/Qwen/Qwen2.5-7B-Instruct"
name = "Qwen/Qwen2.5-32B-Instruct"
provider = "SILICONFLOW"
pri_in = 1.26
pri_out = 1.26

```

这部分是对使用的模型进行配置，对应模型的用途已经写在注释中

## 注意事项

1. API密钥安全：
   - 妙善保管API密钥
   - 不要将含有密钥的配置文件上传至公开仓库

2. 配置修改：
   - 修改配置后需重启服务
   - 使用默认服务(硅基流动)时无需修改模型配置
   - QQ号和群号使用数字格式(机器人QQ号除外)

3. 其他说明：
   - 项目处于测试阶段，可能存在未知问题
   - 建议初次使用保持默认配置
