# 这里有一些让你的麦麦更加符合你的需求的帮助

## 如何编写人设

以下几个变量会控制具体的人设：

```toml
[personality]
personality_core = "是一个女大学生，现在在读大二，你会刷贴吧" 
personality_sides = ['有时候说话不过脑子', '喜欢开玩笑', '有时候会表现得无语', '有时候会喜欢说一些奇怪的话']

[identity] 
identity_detail = ['头像形象是一只橙色的鱼，头上有绿色的树叶。']
# 可以描述外貌，性别，身高，职业，属性等等描述

[expression]
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，回复不要浮夸，不要用夸张修辞，平淡一些。不要有额外的符号，尽量简单简短"
```

目前最佳的人设编写方式最好遵守以下建议

###人设

在```personality_core```


###回复风格

你需要在```expression_style```中编写bot说话的方式，这个条目会直接影响到麦麦做出回复的风格。

你需要用1-2句话来描述bot是怎样表达的，怎样说话的。你可以说明可以做的和不可以做的。

以下是一个猫娘的例子
```toml
expression_style = "参考猫的性格回复，可以添加特定的语气词。可以参考轻小说和游戏中的猫娘的语气风格，不要用夸张修辞。不要有额外的符号，尽量简单简短"
```

以下是一个傲娇的例子
```toml
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，参考轻小说和游戏中的傲娇的语气，但是不要总是用这种语气说话。回复不要浮夸。不要有额外的符号，尽量简单简短"
```

（没写完）





## 不同的回复模式有什么区别？

### normal模式

基于每条消息的激活度，产生不同的回复意愿，麦麦会对消息进行并行回复。

回复仅需LLM生成一次，会考虑记忆，关系，人设等信息

**优点**：反应较快，token花费量较少

**缺点**：由于并行回复，消息多时可能回复较为频繁且杂乱，获取到的信息较少

### focus模式

麦麦会持续对聊天内容进行观察，获取信息-处理-决策和执行

不基于某条特定消息触发，而是麦麦对聊天有整体的感知，并由其自己决定是否要回复，或者进行其他动作（不回复，发语音，禁言，画图.....）

麦麦可以对聊天内容有更深入的理解，能够调用工具，能够有稳定的自我认知，以及将思考和表达分离，可以单独定义表达风格

能够通过插件来增加麦麦可以做的事，目前禁言和画图是通过插件实现的

**优点**：对聊天有更深入的理解，可以获取更多信息，做出更多行为，同时可使用插件扩展能力

**缺点**：回复速度较慢，token消耗量较大

### auto自动切换模式

auto模式会根据需要自动切换normal和focus模式

当一定时间内回复次数较多时，normal会转入focus模式。这个阈值可以通过`auto_focus_threshold`调整。

当一定时间内不回复的次数较多，focus模式会转入normal模式。这个阈值可以通过`exit_focus_threshold`来调整。

```toml
[chat] 
auto_focus_threshold = 1 # 自动切换到专注聊天的阈值，越低越容易进入专注聊天
exit_focus_threshold = 1 # 自动退出专注聊天的阈值，越低越容易退出专注聊天
```


## 如何配置normal模式

normal模式有以下配置

```toml
[normal_chat]
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

### 有关回复概率和频率

注意`talk_frequency`，可以影响麦麦在normal下的总体回复表现，麦麦的回复频率会趋向指定的值（1分钟/条），消息少的群会更低

`response_willing_amplifier`和`response_interested_rate_amplifier`会直接提高回复概率

`willing_mode`会影响回复的模式

`mentioned_bot_inevitable_reply` 提及 bot 的名字时，回复概率会大大增加
`at_bot_inevitable_reply` @bot，回复概率会大大增加

## 如何配置focus模式

focus模式有以下配置

```toml
[focus_chat] #专注聊天
think_interval = 3 # 思考间隔 单位秒，可以有效减少消耗
observation_context_size = 15 # 观察到的最长上下文大小,建议15，太短太长都会导致脑袋尖尖
compressed_length = 5 # 不能大于observation_context_size,心流上下文压缩的最短压缩长度，超过心流观察到的上下文长度，会压缩，最短压缩长度为5
compress_length_limit = 5 #最多压缩份数，超过该数值的压缩上下文会被删除
parallel_processing = true #是否平行处理记忆，开启可以节省时间和token
processor_max_time = 20 #处理器超时时间，开启可以防止回复时间过长

[focus_chat_processor] # 专注聊天处理器，打开可以实现更多功能，但是会增加token消耗
self_identify_processor = true # 是否启用自我识别处理器
tool_use_processor = false # 是否启用工具使用处理器
working_memory_processor = false # 是否启用工作记忆处理器
```

如果你希望思考循环的速度慢一些，可以调高`think_interval`

如果你希望思考速度更快一些，可以调低信息处理的最长时间`processor_max_time`，但是会一定程度降低智力

self_identify_processor可以帮助麦麦更加清晰的认识到自己的特征和性格
tool_use_processor可以让麦麦使用工具


## 如何开启麦麦的禁言和画图功能

麦麦的画图和禁言功能目前作为示例插件，默认不启用

所有的插件功能只在focus模式下有效（或auto进入focus模式之后）

如果需要开启禁言插件
 - 首先麦麦必须是管理员
 - 你需要安装最新适配器
 - MMC安装目录/src/plugins/test_plugin/actions/mute_action.py文件中第26行，将`default = False`改为`default = True`

如果需要开启豆包绘图插件
 - 你必须在火山平台开通绘图服务获得key
 - MMC安装目录/src/plugins/test_plugin_pic/actions/pic_action.py文件中第37行，将`default = False`改为`default = True`
 - 修改后，至少启动一次focus模式
 - 将你的绘图key填写到同文件夹的后缀为.toml的配置文件中，重启


## 我对麦麦的说话风格不满意，我想要调整它

你可以从**两个方法**调整它，一个是 **表达风格**和**人设**，另一个是你使用的**AI模型**

### 表达风格和人设

人设可以通过修改[personality]和[identity] 的选项来修改，详见**我如何写一个好的人设**

表达风格可以通过调整配置文件中的expression下的expression_style来改变。
默认的回复风格是：
```toml
expression_style = "回复尽量简短一些。可以参考贴吧，知乎和微博的回复风格，回复不要浮夸，不要用夸张修辞，平淡一些。不要有额外的符号，尽量简单简短"
```
以下是一些其他风格的示例，你可以参考：
（待编写）

注意在normal模式和focus模式下，同样的风格可能表现有差异

同时，如果你启用了表达学习，麦麦会受到群内群友发言习惯影响

### AI模型

麦麦的回复由AI模型生成，因此选择不同的模型也会改变麦麦的说话风格

在normal模式下，配置文件中设置的normal_chat_1模型和normal_chat_2模型会直接影响麦麦的说话风格，你可以修改这两个模型

在focus模式下，focus_expressor模型对麦麦的说话风格有最直接的影响，可以优先更换这个模型。
focus_planner模型也会影响麦麦的表达风格，但是focus_planner同样也会影响麦麦的决策能力，谨慎替换。

