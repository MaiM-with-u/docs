# 语音模块 - GPT_Sovits

这个模块对接的是 GPT_Sovits 的 TTS，其配置样例文件也在`template`文件夹下面。

使用前，你应该复制`template/gpt_sovits.toml`到`config/gpt_sovits.toml`，然后根据你的需要修改配置文件。

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
猫猫已经完成了魔法画法阵，接下来是一些使用说明。

### pipeline 配置
这部分指定平台使用的预设。

- `default_preset`: 默认使用的预设名称。
#### pipeline.platform_presets
- `qq`: QQ平台使用的预设名称。

::: tip
这里的键值需要和`[tts.models.presets]`中`.`后面的名称一致。

比如，你想在QQ平台使用`custom1`预设，那么你需要在这里配置为`custom1`，同时在`[tts.models.presets]`中也要有`[tts.models.presets.custom1]`的配置。
:::

::: tip
这里的键名是平台的名称，也是Adapter的标识名称。
比如 MaiBot Napcat Adapter 默认使用`qq`作为标识符，那这里就应该设置为`qq=你的预设`
:::

### tts 配置
这部分是配置GPT-SoVITS API 的相关参数。

- `host`: GPT-SoVITS API 的主机地址，通常为 `127.0.0.1`，即本机地址。
- `port`: GPT-SoVITS API 的端口，默认为 `9880`。
- `ref_audio_path`: 默认参考音频路径，记得更换为你自己的参考音频喵。
- `prompt_text`: 默认提示文本，记得更换为你自己的提示文本喵。
- `aux_ref_audio_paths`: 辅助参考音频路径列表，可以添加多个辅助参考音频路径，其使用方法和GPT_Sovits的辅助参考音频相同。
- `text_language`: 你要合成的文本语言，默认为中文（`zh`）。
- `prompt_language`: 提示文本的语言，默认为中文（`zh`）。
::: tip
对于`text_language`和`prompt_language`，可选项如下：
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

- `media_type`: 音频格式，仅支持`wav`格式，猫猫建议不要更改喵。
::: details 高级选项
以下的内容如果你对GPT_Sovits不熟悉，可以不做改动。

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
### tts.models 配置

这部分是配置你使用的模型文件的地方。

- `gpt_model`: 默认GPT模型路径，使用之前请更换为你自己的模型，并且确定模型存在且路径无误。
- `sovits_model`: 默认SoVITS模型路径，使用之前请更换为你自己的模型，并且确定模型存在且路径无误。

#### tts.models.presets
这部分是配置你使用的预设角色的地方。

根据[这里](#pipeline-platform-presets)的说明，预设名称需要和`[pipeline.platform_presets]`中`.`后面的名称一致。

这里以`default`为例：

你需要增加一个`[tts.models.presets.default]`的配置 **（如果有则不要二次增加！）**。然后配置如下项目：

- `name`: 角色名称，随意填写。
- `ref_audio`: 参考音频路径，使用之前请更换为你自己的参考音频，并且确定音频存在且路径无误。
- `prompt_text`: 提示文本，文本需要与你参考音频中的内容相同，语言类型需要对应上面的`prompt_language`。
- `gpt_model`: GPT模型路径，使用之前请更换为你自己的模型，并且确定模型存在且路径无误。**（如果不需要使用不同的GPT模型，可以不配置，此时使用的是`[tts.models]`里配置的模型）**
- `sovits_model`: SoVITS模型路径，使用之前请更换为你自己的模型，并且确定模型存在且路径无误。**（如果不需要使用不同的SoVITS模型，可以不配置）**

