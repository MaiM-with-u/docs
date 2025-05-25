# MaiBot TTS 语音配置指南 ✨

本文档是墨百灵为大家准备的 MaiBot TTS Adapter 的配置指南~。

此 Adapter 是一个用于将 MaiBot 的文字消息转换为语音的适配器，语音信息随后通过 Napcat 发送到 QQ。

因此，这个适配器要求**同时安装 Napcat 适配器和 MaiBot TTS 适配器才行喵！**

::: tip
但是，如果各位用的其他平台消息适配器声明了兼容这个适配器，那么 Napcat 适配器就可以不安装。
:::

::: tip
要是各位在配置过程中遇到了困难，同时对语音功能没有那么强烈的需求，那直接用文字聊天也是很棒的选择哦~ 百灵相信大家都能找到最适合自己的方式喵！❤️
:::


## 安装步骤
安装这个适配器也十分简单喵，就像安装Napcat适配器一样，只需要从Github上的[仓库](https://github.com/MaiM-with-u/maimbot_tts_adapter)下载适配器文件，然后安装好依赖，再进行一些配置，最后启动就可以啦~。
```bash
git clone https://github.com/MaiM-with-u/maimbot_tts_adapter.git
cd maimbot_tts_adapter
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
python main.py
```

## 配置文件详解

相比于Napcat适配器，TTS适配器的配置文会复杂那么一丢丢，但是百灵相信各位能够看懂，并且成功克服所有困难，让自己的小机器人开口说话的喵！

TTS适配器的所有配置样例文件都在`template_configs`文件夹下面，各位可以根据自己的喜好和需求，选择不同的语音服务提供商。

首先，我们需要先从`template_configs/base_template.toml`复制一份配置文件模板到`configs/base.toml`。

首先，百灵来介绍一下基础配置文件 `base.toml` 。
```toml
[server]
host = "127.0.0.1"
port = 8070

[routes]
qq = "http://127.0.0.1:8000/ws"
[probability]
voice_probability = 0.2 # 使用语音的概率

[enabled_tts] # 启用的TTS模块，请与各插件的目录名称一致
enabled = ["GPT_Sovits"]

[tts_base_config]
stream_mode = false  # 是否启用流式输出
post_process = false # 是否启用后处理（现阶段无效）
```

在开始详细的配置讲解之前，百灵先用一个示意图，给各位展示一下 Napcat 适配器、TTS 适配器和 MaiBot 核心之间的数据流：

**原来的：**

```mermaid
graph LR
    A[Napcat Adapter] <--> B[MaiBot 核心]
```

**启用了TTS之后：**

```mermaid
graph LR
    A[Napcat Adapter] <--> B[TTS Adapter]
    B <--> C[MaiBot 核心]
```

相信各位一定发现了，现在 Napcat Adapter 的服务器不再直接指向 MaiBot 核心了，而是指向了我们的TTS适配器！因此，我们需要稍微修改一下 **Napcat Adapter** 的 `config.toml` 文件中的几个小地方：

```toml
[MaiBot_Server]
platform_name = "qq"
host = "localhost"
port = 8070
[Voice]
use_tts = true
```

这里的`host`要对应我们`base.toml`里的`host`字段，`port`也要对应`base.toml`里的`port`字段。

接下来，百灵继续解释一下 `base.toml` 文件里其他配置项。

### `routes` 路由配置
在这个配置里，键名代表正在使用的适配器平台的名称。百灵推荐大家直接使用 `qq` ，因为 Napcat Adapter 默认的平台名称就是 `qq` 。当然啦，如果你使用的是其他的适配器，你可以在这里修改为你使用的适配器的名称。

对于键值的url，你只需要把MaiBot主程序 `.env` 文件里面的 `HOST` 和 `PORT` 这两个字段的值组合起来（举个例子，如果HOST是 `127.0.0.1`，PORT是 `8000`，那组合起来就是 `http://127.0.0.1:8000`），然后在这个地址的最后面加上 `/ws` ，就构成了示例里面的url。

### `probability` 语音概率
这个字段是用来设置语音的概率的，其按照百分数计算。

### `enabled_tts` 启用的TTS模块
这个字段是用来指定具体要启用哪个TTS模块。使用时请在这里填上自己想要使用的那个TTS模块对应的文件夹名称，且此项目对大小写敏感。
::: info 百灵小贴士
内置支持的语音模块有这些：
1. [GPT_Sovits](./gpt_sovits) 
2. [Qwen_omni](./qwen_omni)
3. [Doubao_TTS](./doubao_tts)

填入内容的时候请从上面的列表中选择，并注意大小写哦~
:::
虽然理论上这里可以填上好几个模块的名字，但是目前这个版本的适配器只支持同时启用一个语音模块哦。各位就从里面选一个最喜欢的填进去就好啦。

选择并且填写完成之后，各位就可以点击上面列表里面的链接，直接跳转到对应模块的详细配置文档，继续进行后续的设置工作啦。

### `tts_base_config` TTS基础配置
这个字段是用来设置语音模块的基础配置的，百灵要求各位直接保持默认。

- `stream_mode`：是否启用流式输出。
- `post_process`：是否启用后处理（现阶段无效）。

这两个配置百灵要求你不要改动，除非你知道自己在做什么。实际作用请参考代码。

::: tip 百灵疑难解答小贴士
如果你在使用过程中遇到了问题，你可以看一看[疑难解答](/faq/maibot-tts-adapter/index)
:::