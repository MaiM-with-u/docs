# 千问 Omni TTS 配置教学喵 🎤

喵喵~ 又到了百灵的教学时间啦！这次我们要一起探索的是“千问”大模型提供的TTS语音合成服务哦！请各位拿出小本本，跟着百灵一步一步来配置吧！

首先，还是老规矩喵，我们需要复制一份配置文件模板。请大家找到 `template_configs/Qwen_omni_template.toml` 文件，然后把它复制到 `config/qwen_omni.toml`。复制完成后，我们就可以开始填写配置啦！

打开 `config/Qwen_omni.toml` 文件，各位会看到类似下面的内容喵：

```toml
# 千问 Omni TTS 配置喵
api_key = "your_api_key"  # 请在这里填入从阿里云DashScope获取的API密钥喵！这个非常重要哦！
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1" # 这是千问TTS的API接口地址，一般不需要改动喵~
model_name = "qwen-omni-turbo" # 使用的模型名称，通常保持这个就好啦！
voice_character = "Chelsie"    # 选择喜欢的声音角色喵！“Chelsie”是一个不错的选择哦~ 还有其他角色可以选，具体可以看看千问的文档喵！
media_format = "wav"           # 音频格式，为了最好的兼容性，请务必使用 "wav" 格式喵！
```

### 配置项详解喵 🧐

#### `api_key`
这个是千问TTS服务的API密钥喵！非常非常重要！小可爱们需要前往阿里云的 [DashScope控制台](https://dashscope.console.aliyun.com/) 创建并获取您的API Key。没有这个密钥，MaiBot就没办法让千问开口说话哦！请务必填写真实有效的密钥。

:::warning 喵喵警告！
API Key是您的重要凭证，请妥善保管，不要泄露给他人喵！
:::

#### `base_url`
这个是千问TTS服务的API接口地址喵。通常情况下，小可爱们不需要修改它，保持默认的 `"https://dashscope.aliyuncs.com/compatible-mode/v1"` 就好啦。

#### `model_name`
这里指定了使用的AI模型名称喵。`"qwen-omni-turbo"` 是一个强大又快速的模型，能够提供高质量的语音合成效果。一般情况下，我们也不需要修改这个配置。

#### `voice_character`
选择您希望MaiBot拥有的声音角色喵！千问提供了多种不同的音色，`"Chelsie"` 是其中一个示例。您可以查阅千问TTS的官方文档，看看还有哪些可爱的声音可以选择，然后把您最喜欢的角色名称填在这里。

#### `media_format`
音频输出格式喵。为了确保最佳的兼容性和效果，这里强烈建议并且**必须**使用 `"wav"` 格式喵！所以请保持这个配置不变。

---

好啦！千问TTS的配置教学就到这里结束啦喵！是不是很简单呢？只要小可爱们细心填写好 `api_key`，选择好喜欢的 `voice_character`，MaiBot就能用千问的声音和大家聊天啦！如果在配置中遇到任何疑问，记得查阅阿里云DashScope的官方文档，或者向万能的社区求助哦！百灵会一直为大家加油打气的喵！🎉✨
