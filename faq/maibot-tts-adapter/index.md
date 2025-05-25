# 针对 MaiBot TTS 适配器的常见问题解答

这是一个关于 MaiBot TTS 适配器的常见问题解答页面，目的是让百灵帮助你们更好的理解和使用 TTS 适配器。

## GPT-Sovits 模块
这部分是针对使用`GPT_Sovits`模块的用户常见问题的FAQ。

### NoneType 错误
如果你使用过程中，模型能够正常加载，但是模型无法语音合成，报错信息类似于：
```bash
TTS处理过程中发生错误: Invalid variable type: value should be str, int or float, got None of type <class 'NoneType'>
```
那么先检查一下你的 TTS 适配器是不是最新的版本，如果不是，请更新到最新版本。

注意，一定要从[MaiBot TTS 适配器的 GitHub 仓库](https://github.com/MaiM-with-u/maimbot_tts_adapter)下载最新的代码。

在确保适配器是最新版本的情况下，如果仍然报错，请检查一下你的模型文件是否完整，是否可用，GPT_Sovits版本是否支持。

如果确定模型文件没有问题，但是仍然报错，请确认**你是否是使用的 GPT_Sovits 自带的环境（即`runtime`文件夹下面的`python.exe`）运行的**。\

如果还有问题，来群里问问百灵吧~。