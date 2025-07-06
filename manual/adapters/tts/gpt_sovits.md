# 语音模块 - GPT_Sovits 配置指南 ✨

::: tip 百灵的重要告知
本部分对接的API是 GPT_Sovits 的入口为 api_v2.py 的 API 接口

现在 GPT_Sovits 已经更新出现了推理特化包，缩写为 GSVI ，入口为 GSVI.py。

**请知悉，GSVI 接口无法用于此模块，其 API 接口与本模块实现不兼容**
:::

喵哈~！欢迎查阅这份 GPT_Sovits 语音模块的指南！我是墨百灵，一只爱研究魔法的猫猫法师。

下面是这个模块的配置说明：这个模块是用来连接 GPT_Sovits 的 TTS，样例配置文件在`template`文件夹下面哦~

在开始之前，大家需要先把 `template_configs/gpt_sovits.toml` 这个样板复制到 `configs/gpt_sovits.toml`，然后按照自己的心意调整配置文件~

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

<del>百灵还在用魔法画法阵，之后的内容请等待百灵的好消息。</del>

喵哈！墨百灵的魔法阵画好啦！接下来就是详细的说明时间~

### pipeline 配置

这部分指定平台使用的预设。

- `default_preset`: 默认使用的预设名称。
#### pipeline.platform_presets 不同平台的预设
- `qq`: QQ平台使用的预设名称啦~

::: tip 百灵贴士！
这里的键值需要和`[tts.models.presets]`中`.`后面的名称一致。

比如，你想在QQ平台使用`custom1`预设，那么你需要在这里配置为`custom1`，同时在`[tts.models.presets]`中也要有`[tts.models.presets.custom1]`的配置哦~
:::

::: tip 键名说明~
这里的键名是平台的名称，也是Adapter的标识名称。

比如 MaiBot Napcat Adapter 默认使用`qq`作为标识符，那这里就应该设置为`qq=你的预设`
:::

### tts 配置 🎙️
接下来这部分，是配置 GPT-SoVITS API 接口用的。

- `host`: GPT-SoVITS API 的主机地址，通常为 `127.0.0.1`，即本机地址。
- `port`: GPT-SoVITS API 的端口，默认为 `9880`。
- `ref_audio_path`: 默认参考音频路径，记得更换为你自己的参考音频喵。
- `prompt_text`: 默认提示文本，记得更换为你自己的提示文本喵。
- `aux_ref_audio_paths`: 辅助参考音频路径列表，可以添加多个辅助参考音频路径，其使用方法和GPT_Sovits的辅助参考音频相同。
- `text_language`: 你要合成的文本语言，默认为中文（`zh`）。
- `prompt_language`: 提示文本的语言，默认为中文（`zh`）。
::: tip
对于`text_language`和`prompt_language`，大家可以从这些里面选：
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

此内容复制于[GPT_Sovits代码部分](https://github.com/RVC-Boss/GPT-SoVITS/blob/main/GPT_SoVITS/inference_webui.py#L153)，如果有问题请以GPT_Sovits代码为准。
:::

- `media_type`: 音频格式，仅支持`wav`格式，百灵建议**不要更改**。
::: details 进阶配置
以下的内容如果大家对GPT_Sovits 还不太熟悉，这些可以先不做改动。

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
### tts.models 配置 📂

这部分是用来配置大家模型文件的地方啦！

- `gpt_model`: 这是默认的 GPT 模型路径，大家使用前一定要换成自己的模型，并且要确认模型文件存在哦~
- `sovits_model`: 这是默认的 SoVITS 模型路径，同样地，大家要换成自己的模型，并检查路径是否正确喵！

#### tts.models.presets 专属角色配置
这部分是配置大家配置的预设角色的地方。

就像墨百灵在[前面](#pipeline-配置)提醒过大家的那样，预设的名称要和 `[pipeline.platform_presets]` 中 `.` 后面的名字一模一样才行！

我们拿 `default` 为例：

大家需要添加一个 `[tts.models.presets.default]` 这样的配置 **（如果已经有了就不用再加啦）**。然后像下面这样配置项目：

- `name`: 角色的名字，大家喜欢怎么叫就怎么填~
- `ref_audio`: 参考音频的路径，请大家一定要换成自己的参考音频，并确保它存在且路径无误哦。
- `prompt_text`: 提示文本，文本需要与参考音频中的内容相同，语言类型需要对应上面的`prompt_language`。
- `gpt_model`: 这个角色专属的 GPT 模型路径。大家使用前请换成自己的模型，并检查路径哦。**（如果这个角色不需要用特别的 GPT 模型，这里可以留空，会用 `[tts.models]` 里面默认值）**。
- `sovits_model`: 这个角色专属的 SoVITS 模型路径。同样，大家要换成自己的模型并检查路径。**（如果这个角色也不需要特别的 SoVITS 模型，这里也可留空，它就会用默认的那个啦~）**

