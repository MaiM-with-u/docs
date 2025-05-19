# MaiBot TTS Adapter 文档

这个文档是为MaiBot TTS适配器编写的，适配器的功能是将 MaiBot 的文本转化为语音，并通过 Napcat 发送到QQ。

因此，这个适配器的使用需要**同时安装 Napcat 适配器和 MaiBot TTS 适配器。**

::: tip
但是如果你使用的其他平台消息适配器声明了可以使用这个适配器，那么你就不需要安装 Napcat 适配器了。
:::

::: tip
如果你在使用的过程中遇到了困难，同时你对语音没什么特别大的需求，那么建议你不要使用这个适配器，直接使用文本聊天就可以了。
:::

## 安装
安装这个适配器也十分简单喵，类似Napcat适配器，只需要从Github上的[Repo](https://github.com/MaiM-with-u/maimbot_tts_adapter)下载适配器文件，然后安装依赖，做好配置，然后启动即可~。
```bash
git clone https://github.com/MaiM-with-u/maimbot_tts_adapter.git
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
python main.py
```

## 配置

相比于Napcat适配器，TTS适配器的配置文件要复杂很多的喵，但是猫猫相信大家能够看懂，克服困难，让你的小机器人说出话来。

TTS适配器的配置样例文件都在`template`文件夹下面，你可以根据自己的需要使用不同的语音服务商。

首先猫猫来介绍一下基础配置文件`base.toml`。
```toml
[server]
host = "127.0.0.1"
port = 8070

[routes]
qq = "http://127.0.0.1:8000/ws"

[probability]
voice_probability = 0.2 # 使用语音的概率

[enabled_tts] # 启用的TTS模块，请与各插件的目录名称一致
enabled = []

[tts_base_config]
stream_mode = false  # 是否启用流式输出
post_process = false # 是否启用后处理（现阶段无效）
```

首先，猫猫给出 Napcat 适配器、TTS 适配器和 MaiBot 之间的数据流示意图：

```mermaid
graph LR
    A[Napcat Adapter] <--> B[TTS Adapter]
    B <--> C[MaiBot]
```

相信你一定发现了，现在 Napcat Adapter 的服务器不再是 MaiBot 了，所以我们需要修改 **Napcat Adapter** 的 `config.toml`中的几个字段：

```toml
[MaiBot_Server]
platform_name = "qq"
host = "localhost"
port = 8070
[Voice]
use_tts = true
```
这里呢，这个`host`要对应我们`base.toml`里的`host`字段，`port`也要对应`base.toml`里的`port`字段。

然后猫猫来解释一下`base.toml`里面剩下的内容。

### routes
这里呢，qq是你在使用的适配器的名称，猫猫建议你使用`qq`，因为 Napcat Adapter 的默认名称为`qq`。当然啦，如果你使用的是其他的适配器，你可以在这里修改为你使用的适配器的名称。

至于后面的网址，你需要做的就是吧麦麦`.env`文件中的`HOST`和`PORT`字段拼接起来，像上面那样，然后加上`/ws`，就可以了。

### probability
这个字段是用来设置语音的概率的，你想用多少的概率都可以哦。

### enabled_tts
这个字段是用来设置你启用的语音模块的，你可以在这里添加你想要使用的语音模块。**注意，这里的模块名称要和你安装的模块的目录名称一致哦。**
::: info
现在内置的语音模块有：
1. [GPT_Sovits](./gpt_sovits)
2. Qwen_omni
3. Doubao_TTS

填入内容的时候请从上面的列表中选择，并注意大小写哦~
:::
虽然理论上你可以填多个，但是现在的适配器只支持一个语音模块，所以你只需要填一个就可以了。

填完之后，你可以点击上面的链接，进入到每个模块的配置页面，进行详细的配置。

### tts_base_config
这个字段是用来设置语音模块的基础配置的，猫猫建议你使用默认值就可以了。

- `stream_mode`：是否启用流式输出。
- `post_process`：是否启用后处理（现阶段无效）。

这两个配置猫猫要求你不要改动，除非你知道自己在做什么。

实际作用请参考代码。