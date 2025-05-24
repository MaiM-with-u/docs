# 语音模块 - 豆包 TTS 配置指南 ✨

这个模块，对接的是 豆包 TTS 提供的TTS语音合成服务哦！

首先，我们需要先从`template_configs/Doubao_tts_template.toml`复制一份配置文件模板到`configs/Doubao_tts.toml`。

```toml
# 注：所有标有 [*] 的都请参考官方文档 https://www.volcengine.com/docs/6561/1257584 进行配置与解读
[app] # 豆包TTSapp配置
base_url = "https://openspeech.bytedance.com/api/v1/tts" # API地址
# 以下部分由官方文档，请参考 https://www.volcengine.com/docs/6561/196768 的Q1部分
appid = ""
token = ""
cluster = ""
[audio] # 音频配置
voice_type = "" # [*]
emotion = "" # 现阶段无效，请保留为空 [*]
enable_emotion = false # 现阶段无效，请保留为false [*]
emotion_scale = 0 # 现阶段无效，请保留为0 [*]
speed_ratio = 1.0 # 语速，范围0.8-2.0，默认1.0
explicit_language = "" # 明确语种 [*]
context_language = "" # 参考语种 [*]
loudness_ratio = 1.0 # 音量，范围0.5-2.0，默认1.0 [*]
[request]
silence_duration = 0 # 句尾静音时长，单位ms，默认0，最大300000 [*]
```

## 配置项详解

这里所有的配置内容呢，都是根据[官方文档](https://www.volcengine.com/docs/6561/1257584)的内容写的，所以如果你有什么疑问的话，记得去看官方文档哦~

### `app`
这部分内容，如何获取请参考[另外一个官方文档](https://www.volcengine.com/docs/6561/196768)的 Q1 部分哦。
- `base_url`: 这个是豆包TTS服务的API接口地址。在绝大多数情况下，保持默认就好啦。
- `appid`: 申请的应用ID（AppID）。
- `token`: 访问令牌（Token）喵。
- `cluster`: 集群信息

### `audio` 音频参数

- `voice_type`: 音色设置！豆包TTS服务提供了许许多多种不同的音色，可以通过查阅[豆包官方提供的音色列表](https://www.volcengine.com/docs/6561/1257544)，从里面找到自己最喜欢的那一款音色的代码，然后把代码填写到这里。
- `emotion`: 现在没有用，一定要留空！
- `enable_emotion`: 现在没有用，一定要留空！
- `emotion_scale`: 现在没有用，一定要留空！
- `speed_ratio`: 语速设定，范围是 `0.8` 到 `2.0`，默认值是 `1.0`。
- `explicit_language`: 明确语种。这部分是告诉大模型要读什么语言。
::: tip 百灵贴士（2025/05/22版）
现在根据[官方文档](https://www.volcengine.com/docs/6561/1257584)，可填写的方式如下：
- 不填: 正常中英文混合
- `crosslingual`: 多语种混合（包含`zh`/`en`/`ja`/`es-ms`/`id`/`pt-br`）
- `zh`: 中文为主，支持中英混
- `en`: 仅英文
- `ja`: 仅日文
- `es-mx`: 仅墨西哥西班牙语
- `id`: 仅印尼语
- `pt-br`: 仅巴西葡萄牙语
:::
- `context_language`: 给模型提供参考的语种。
::: tip 百灵贴士（2025/05/22版）
根据[官方文档](https://www.volcengine.com/docs/6561/1257584)，现在可以填写的方式如下：
- 不填: 西欧语种采用英语。
- `id`: 西欧语种采用印尼语。
- `es`: 西欧语种采用墨西哥西班牙语。
- `pt`: 西欧语种采用巴西葡萄牙语。
:::
- `loudness_ratio`: 音量大小调节。这部分的音量可以从0.5到2.0之间选一个小数，默认是1.0。

### `request`
这部分内容归类到`request`，是因为官方参数列表就是这么写的喵~

- `silence_duration`: 设置在每句话说完之后，要额外增加多少静音时长。单位是毫秒。默认是 `0`，表示不额外添加静音。最大可以设置到 `300000` 毫秒。