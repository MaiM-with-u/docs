# 喵~ 语音模块 - GPT_Sovits 魔法指南 ✨

喵哈~！各位勇敢的冒险者们，欢迎查阅这份 GPT_Sovits 语音模块的魔法指南！我是墨百灵，一只爱研究魔法的猫娘法师，我的主人是超~厉害的墨梓柒大人！✨ 主人派我来为大家准备这份指南哦！这个模块是用来连接 GPT_Sovits 的 TTS 哒，配置文件的小样板也乖乖地躺在`template`文件夹下面哦~

在开始施展语音魔法之前，大家需要先把 `template_configs/gpt_sovits.toml` 这个小卷轴复制到 `config/gpt_sovits.toml`，然后按照自己的心意来调整里面的咒语哦！

```toml
[pipeline]
# pipeline预设配置
default_preset = "default"  # 默认使用的预设名称

# pipeline平台预设映射
[pipeline.platform_presets]
qq = "default"       # QQ平台使用default预设

[tts]
# GPT-SoVITS API 配置
host = "127.0.0.1"
port = 9880

# 参考音频配置
ref_audio_path = "zh-CN-XiaoyiNeural.mp3"    # 默认参考音频路径
prompt_text = "这是一段测试音频"            # 默认提示文本
aux_ref_audio_paths = []                    # 辅助参考音频路径列表

# 语音合成基础配置
text_language = "zh"      # 文本语言
prompt_language = "zh"    # 提示语言
media_type = "wav"        # 音频格式:wav/raw/ogg/aac

# GPT-SoVITS 模型参数
top_k = 12                # top k 采样
top_p = 1.0              # top p 采样
temperature = 1.0        # 温度系数
batch_size = 1           # 批处理大小
batch_threshold = 0.75   # 批处理阈值
speed_factor = 1.0       # 语速控制
text_split_method = "cut5" # 文本分割方法
repetition_penalty = 1.35 # 重复惩罚系数
sample_steps = 32        # VITS采样步数
super_sampling = false    # 是否启用超采样

[tts.models]
# GPT模型配置
gpt_model = "GPT_SoVITS/pretrained_models/XiangNaimei-e5.ckpt"  # GPT模型路径
sovits_model = "GPT_SoVITS/pretrained_models/XiangNaimei_e4_s248.pth"  # SoVITS模型路径

# 自定义角色预设
[tts.models.presets]
# 预设角色配置示例
[tts.models.presets.default]
name = "默认角色"
ref_audio = "GPT_SoVITS/pretrained_models/voices/平淡.WAV"
prompt_text = "嗨！我每天都会像这样做发声训练的。"
gpt_model = ""     # 为空则使用默认GPT模型
sovits_model = ""  # 为空则使用默认SoVITS模型

[tts.models.presets.custom1]
name = "kanami"
ref_audio = "GPT_SoVITS/pretrained_models/voices/平淡.WAV"
prompt_text = "嗨！我每天都会像这样做发声训练的。"
gpt_model = "GPT_SoVITS/pretrained_models/XiangNaimei-e5.ckpt"
sovits_model = "GPT_SoVITS/pretrained_models/XiangNaimei_e4_s248.pth"
```

<del>猫猫还在用魔法画法阵，之后的内容请等待猫猫的好消息。</del>
喵哈哈！墨百灵的魔法阵画好啦！接下来就是详细的魔法咒语说明时间~

### pipeline 配置喵 ⚙️
这部分是用来指定不同平台要使用哪个预设魔法的哦~

- `default_preset`: 这是默认情况下使用的预设魔法名称~
#### pipeline.platform_presets 平台专属魔法 ✨
- `qq`: QQ平台要使用的预设魔法名称就是这个啦！

::: tip 喵喵提示！
这里的键值呀，要和后面 `[tts.models.presets]` 中那个点点 `.` 后面的名字一模一样才行哦。比如说，如果大家想在QQ平台用 `custom1` 这个预设魔法，那这里就要写成 `custom1`，同时 `[tts.models.presets]` 那边也要有一个叫做 `[tts.models.presets.custom1]` 的魔法配方才行喵！
:::

::: tip 再叮嘱一下大家~
这里的键名呢，就是平台的名称，也是我们的小助手（Adapter）认识它的暗号哦。比如 MaiBot Napcat Adapter 默认是用 `qq` 这个暗号，那大家这里就要写成 `qq=你的预设魔法` 这样子~
:::

### tts 配置喵 🎙️
接下来这部分，是配置 GPT-SoVITS API 接口的魔法参数时间！

- `host`: 这是 GPT-SoVITS API 魔法接口的主机地址，一般都是 `127.0.0.1`，也就是大家自己的电脑地址啦~
- `port`: 这是 GPT-SoVITS API 魔法接口的端口号，默认是 `9880` 喵。
- `ref_audio_path`: 这是默认的参考音频路径，大家可要记得换成自己的声音样本哦，喵~
- `prompt_text`: 这是默认的提示文本，也请大家换成自己喜欢的句子吧，喵！
- `aux_ref_audio_paths`: 这里是辅助参考音频的列表，大家可以放好多好多辅助参考音频进去，用法和 GPT_Sovits 官方说的一样哦！
- `text_language`: 大家想要合成什么语言的文本呢？默认是可爱的中文（`zh`）哦。
- `prompt_language`: 提示文本用的是什么语言呀？默认也是中文（`zh`）呢。
::: tip 喵喵小课堂开课啦！
对于`text_language`和`prompt_language`，大家可以从这些里面选哦：
- `zh`: 中英文混合
- `ja`: 日英文混合
- `yue`: 粤语英文混合
- `ko`: 韩英文混合
- `auto`: 多语种混合
- `auto_yue`: 多语种混合（包含粤语）
- `all_zh`: 纯中文
- `en`: 纯英文
- `all_ja`: 纯日文
- `all_yue`: 纯粤语
- `all_ko`: 纯韩文

此内容复制于[GPT_Sovits代码部分](https://github.com/RVC-Boss/GPT-SoVITS/blob/main/GPT_SoVITS/inference_webui.py#L153)，如果那里更新了，要以那边的为准哦！
:::

- `media_type`: 音频的格式~ 目前只支持 `wav` 这种格式，墨百灵建议大家不要轻易改动它哦，喵。
::: details 进阶魔法区域！
以下的内容如果大家对GPT_Sovits 还不太熟悉，这些可以先不用动它们哦。

- `top_k`: top k 采样，默认为 `12`。
- `top_p`: top p 采样，默认为 `1.0`。
- `temperature`: 温度系数，默认为 `1.0`。
- `batch_size`: 批处理大小，默认为 `1`。
- `batch_threshold`: 批处理阈值，默认为 `0.75`。
- `speed_factor`: 语速控制，默认为 `1.0`。
- `text_split_method`: 文本分割方法，默认为 `cut5`。
- `repetition_penalty`: 重复惩罚系数，默认为 `1.35`。
- `sample_steps`: VITS采样步数，默认为 `32`。
- `super_sampling`: 是否启用超采样，默认为 `false`。
:::
### tts.models 配置喵 📂

这部分是用来配置大家珍藏的魔法模型文件的地方啦！

- `gpt_model`: 这是默认的 GPT 模型路径，大家使用前一定要换成自己的模型，并且要确认模型文件乖乖地待在正确的路径下，没有迷路哦！
- `sovits_model`: 这是默认的 SoVITS 模型路径，同样地，大家要换成自己的模型，并检查路径是否正确喵！

#### tts.models.presets 专属角色魔法 ✨
这里就是配置大家专属的预设角色魔法的地方啦！

就像墨百灵在[前面](#pipeline-platform-presets-平台专属魔法-✨)提醒过大家的那样，预设的名称要和 `[pipeline.platform_presets]` 中那个点点 `.` 后面的名字一模一样才行！

我们拿 `default` 这个预设来举个例子吧~

大家需要添加一个 `[tts.models.presets.default]` 这样的配置咒语 **（如果已经有了就不用再加啦，不然会打架的！）**。然后呢，就像下面这样配置项目：

- `name`: 角色的名字，大家喜欢怎么叫就怎么填~
- `ref_audio`: 参考音频的路径，请大家一定要换成自己的声音样本，并确保它在正确的地方哦。
- `prompt_text`: 提示用的文本，这里面的内容要和参考音频里说的一样，语言也要和前面设置的 `prompt_language` 对应上才行喵。
- `gpt_model`: 这个角色专属的 GPT 模型路径。大家使用前请换成自己的模型，并检查路径哦。**（如果这个角色不需要用特别的 GPT 模型，这里可以留空，它就会乖乖用 `[tts.models]` 里面那个默认的啦！）**
- `sovits_model`: 这个角色专属的 SoVITS 模型路径。同样，大家要换成自己的模型并检查路径。**（如果这个角色也不需要特别的 SoVITS 模型，这里也可以不填，它就会用默认的那个啦~）**

