# 这里有一些让你的麦麦更加符合你的需求的帮助

## 如何编写人设

以下几个变量会控制具体的人设：

```toml
[personality]
# 建议50字以内，描述人格的核心特质
personality_core = "是一个女大学生，现在在读大二" 
# 人格的细节，可以描述人格的一些侧面，条数任意，不能为0，不宜太多
personality_sides = [
    "用一句话或几句话描述人格的一些侧面",
    "用一句话或几句话描述人格的一些侧面",
]
compress_personality = false # 是否压缩人格，可以节省token

[identity] 
# 可以描述外貌，性别，身高，职业，属性等等描述
identity_detail = [
    "年龄为20岁",
    "是女孩子",
]
compress_indentity = true # 是否压缩身份，可以节省token

[expression]
# 表达方式
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，回复不要浮夸，不要用夸张修辞，平淡一些。不要有额外的符号，尽量简单简短"
enable_expression_learning = false # 是否启用表达学习，麦麦会学习不同群里人类说话风格，打开后麦麦可以学习风格
learning_interval = 600 # 学习间隔 单位秒
expression_groups = [
    ["qq:1919810:private","qq:114514:private"], # 在这里设置互通组，相同群组会共享学习到的表达方式
]
```

目前最佳的人设编写方式最好遵守以下建议

### 人设

在`personality_core`中用一两句话简要描述最核心的人设，然后在`personality_sides`和`identity_detail`中补充细节。
`compress_personality` 和 `compress_indentity` 可以节省一些性能开销，但可能会丢失部分细节，如果人设不长，可以关闭。

### 回复风格

你需要在`expression_style`中编写bot说话的方式，这个条目会直接影响到麦麦做出回复的风格。

你需要用1-2句话来描述bot是怎样表达的，怎样说话的。你可以说明可以做的和不可以做的。
如果你开启了`enable_expression_learning`，麦麦还会自主学习群友的说话风格。

以下是一个猫娘的例子
```toml
expression_style = "参考猫的性格回复，可以添加特定的语气词。可以参考轻小说和游戏中的猫娘的语气风格，不要用夸张修辞。不要有额外的符号，尽量简单简短"
```

以下是一个傲娇的例子
```toml
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，参考轻小说和游戏中的傲娇的语气，但是不要总是用这种语气说话。回复不要浮夸。不要有额外的符号，尽量简单简短"
```


## 不同的回复模式有什么区别？

### normal模式

基于每条消息的激活度，产生不同的回复意愿，麦麦会对消息进行并行回复。

回复仅需LLM生成一次，会考虑记忆，关系，人设等信息，开启planner之后可以进行其他动作（发语音，禁言，画图.....）

**优点**：反应非常快（使用非推理模型），token花费量较少

**缺点**：由于并行回复，消息多时可能回复较为频繁且杂乱，获取到的信息较少

### focus模式

麦麦会持续对聊天内容进行观察，获取信息-处理-决策和执行

不基于某条特定消息触发，而是麦麦对聊天有整体的感知，并由其自己决定是否要回复，或者进行其他动作（不回复，发语音，禁言，画图.....）

麦麦可以对聊天内容有更深入的理解，能够调用工具，能够有稳定的自我认知，以及将思考和表达分离，可以单独定义表达风格


**优点**：对聊天有更深入的理解，可以获取更多信息，做出更多行为，同时可使用插件扩展能力

**缺点**：回复速度稍慢，token消耗量较大

### auto自动切换模式

auto模式会根据需要自动切换normal和focus模式

当一定时间内回复次数较多时，normal会转入focus模式。这个阈值可以通过`auto_focus_threshold`调整。

当一定时间内不回复的次数较多，或达到focus持续时间上限，focus模式会转入normal模式。这个阈值可以通过`exit_focus_threshold`来调整。

## 如何配置回复频率与自动模式

麦麦的回复频率与自动模式切换现在由`[chat]`中的多个参数共同控制，可以实现全局、分时段、分群的精细化管理。

```toml
[chat]
# --- 频率设置 ---
talk_frequency = 1
time_based_talk_frequency = ["8:00,1", "12:00,1.5", "18:00,2", "01:00,0.5"]
talk_frequency_adjust = [
    ["qq:114514:group", "12:20,1", "16:10,2", "20:10,1", "00:10,0.3"],
]

# --- 自动模式阈值 ---
auto_focus_threshold = 1
exit_focus_threshold = 1
```

### 频率配置的优先级
麦麦的回复频率遵循以下优先级顺序：
**特定聊天配置 (`talk_frequency_adjust`) > 全局时段配置 (`time_based_talk_frequency`) > 全局默认配置 (`talk_frequency`)**

这意味着，如果一个群聊同时满足 `talk_frequency_adjust` 和 `time_based_talk_frequency` 的设置，会优先采用 `talk_frequency_adjust` 中的规则。

### 1. 全局默认频率 (`talk_frequency`)
这是一个基础值，当没有任何其他频率规则生效时，会使用这个频率。

### 2. 全局分时段频率 (`time_based_talk_frequency`)
你可以设置在一天中的不同时间段，让麦麦有不同的全局回复频率。
- **格式**: 每一项都是一个 `"HH:MM,frequency"` 格式的字符串。
- **说明**: 表示从 `HH:MM` 这个时间点开始，麦麦的回复频率将调整为 `frequency`，直到下一个时间点为止。
- **示例解释**: 在上面的例子中，从中午 `12:00` 到下午 `17:59`，频率为 `1.5`。
- 时间会自动排序，所以你不需要担心书写顺序。

### 3. 特定聊天的独立频率 (`talk_frequency_adjust`)
这是最精确的控制方式，可以为某一个群聊或某一个私聊单独设置一套完整的分时段回复频率。
- **格式**: `["platform:id:type", "HH:MM,frequency1", "HH:MM,frequency2", ...]`
    - **聊天标识符**: `platform:id:type`
        - `platform`: 平台名称，例如 `qq`。
        - `id`: 你的群号或者用户的QQ号。
        - `type`: `group` 代表群聊，`private` 代表私聊。
    - **后续元素**: 与 `time_based_talk_frequency` 格式相同。
- **示例解释**: 对于QQ群 `114514`，从 `12:20` 开始频率为`1`，`16:10`开始频率为`2`，以此类推。
- **注意**: 这里定义的规则 **仅对** 指定的聊天生效。

### auto模式切换阈值
- `auto_focus_threshold`: 自动切换到专注聊天的阈值，越低越容易进入专注聊天。
- `exit_focus_threshold`: 自动退出专注聊天的阈值，越低越容易退出专注聊天。

## 如何配置normal模式

normal模式有以下配置:

```toml
[normal_chat]
normal_chat_first_probability = 0.5 # 麦麦回答时选择首要模型的概率
max_context_size = 15 #上下文长度
emoji_chance = 0.2 # 麦麦一般回复时使用表情包的概率
thinking_timeout = 120 # 麦麦最长思考时间

willing_mode = "classical" # 回复意愿模式
response_interested_rate_amplifier = 1 # 麦麦回复兴趣度放大系数
emoji_response_penalty = 0 # 对其他人发的表情包回复惩罚系数
mentioned_bot_inevitable_reply = true # 提及 bot 必然回复
at_bot_inevitable_reply = true # @bot 必然回复
enable_planner = false # 是否启用动作规划器，让麦麦可以再normal模式下使用插件
```

### 有关回复意愿

- `willing_mode`会影响回复的模式。
- `response_interested_rate_amplifier` 会在麦麦听到感兴趣的内容时提高回复概率。
- `mentioned_bot_inevitable_reply` 和 `at_bot_inevitable_reply` 控制在被提及或@时是否必然回复。

## 如何配置focus模式

focus模式有以下配置:

```toml
[focus_chat] #专注聊天
think_interval = 3 # 思考间隔 单位秒，可以有效减少消耗
consecutive_replies = 1 # 连续回复能力，值越高，麦麦连续回复的概率越高
processor_max_time = 20 # 处理器最大时间，单位秒
observation_context_size = 20 # 观察到的最长上下文大小
compressed_length = 8 # 心流上下文压缩的最短压缩长度
compress_length_limit = 4 #最多压缩份数

[focus_chat_processor] # 专注聊天处理器，打开可以实现更多功能，但是会增加token消耗
person_impression_processor = true # 是否启用关系识别处理器
tool_use_processor = false # 是否启用工具使用处理器
working_memory_processor = false # 是否启用工作记忆处理器，消耗量大
expression_selector_processor = true # 是否启用表达方式选择处理器
```

如果你希望思考循环的速度慢一些，可以调高`think_interval`。

如果你希望思考速度更快一些，请优先使用非推理模型

- `person_impression_processor` 可以帮助麦麦更加清晰的认识到他人的特征和性格。
- `tool_use_processor` 可以让麦麦使用工具。
- `working_memory_processor` 是工作记忆处理器，消耗量较高，不建议轻易开启。
- `expression_selector_processor` 负责选择合适的表达方式进行回复。

## 如何开启麦麦的禁言功能

麦麦的画图和禁言功能目前作为示例插件，默认不启用

所有的插件功能只在focus模式下有效（或auto进入focus模式之后）

如果需要开启禁言插件
 - 首先麦麦必须是管理员
 - 你需要安装最新适配器
 - MMC安装目录src/plugins/built_in/mute_plugin/config.toml文件中第8行，将`enabled = false`改为`enabled = true`

## 如何开启麦麦的豆包绘图功能
如果需要开启豆包绘图插件
 - 你必须在火山平台开通绘图服务获得key
 - 先将[doubao_pic_plugin](https://github.com/schxar/doubao_pic_plugin) 克隆到 plugins 目录下
```python
git clone https://github.com/schxar/doubao_pic_plugin.git plugins/doubao_pic_plugin
```
 - 在MMC安装目录plugins/doubao_pic_plugin/config.toml中，将`enabled = false`改为`enabled = true`
 - 修改后，至少启动一次focus模式
 - 将你的绘图key也填入config.toml配置文件中，重启

## 我对麦麦的说话风格不满意，我想要调整它

你可以从**两个方法**调整它，一个是 **表达风格**和**人设**，另一个是你使用的**AI模型**

### 表达风格和人设

人设可以通过修改[personality]和[identity] 的选项来修改，详见**如何编写人设**。

表达风格可以通过调整配置文件中的`expression`下的`expression_style`来改变。
默认的回复风格是：
```toml
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，回复不要浮夸，不要用夸张修辞，平淡一些。不要有额外的符号，尽量简单简短"
```
同时，如果你启用了表达学习，麦麦会受到群内群友发言习惯影响。

### AI模型

麦麦的回复由AI模型生成，因此选择不同的模型也会改变麦麦的说话风格。

- 在`normal`模式下，配置文件中设置的`replyer_1`模型和`replyer_2`模型会直接影响麦麦的说话风格，你可以修改这两个模型。
- 在`focus`模式下，`replyer_1`模型对麦麦的说话风格有最直接的影响（因为它也负责表达），可以优先更换这个模型。
- `planner`模型也会影响麦麦的决策能力，谨慎替换。
