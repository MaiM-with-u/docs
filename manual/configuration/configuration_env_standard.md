# 🔧 .env 配置指南

## 简介

本页面将会告诉你如何通过修改`.env`文件，配置你的apikey，以及新增其他服务商的apikey。

## API配置说明

`.env` 和 `bot_config.toml` 中的API配置关系如下：

### 在.env中定义API凭证

```ini
# API凭证配置
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/
DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1
BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
# ... 其他服务商

SILICONFLOW_KEY=your_key
DEEP_SEEK_KEY=your_key
BAILIAN_KEY=your_key
# ... 其他服务商的KEY
```
`.env`文件用于存储所有API服务的地址（`_BASE_URL`）和密钥（`_KEY`）。

### 在bot_config.toml中引用API凭证

在`bot_config.toml`中，你只需要通过`provider`字段指定使用哪个API服务商即可，程序会自动关联到`.env`中对应的前缀。

```toml
[model.replyer_1]
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"         # 引用.env中定义的 "SILICONFLOW" 前缀
```

如需切换到其他API服务，只需修改`provider`和`name`：

```toml
[model.replyer_1]
name = "deepseek-chat"       # 改成DeepSeek对应的模型名称
provider = "DEEP_SEEK"           # 使用DeepSeek provider
```

另一个使用阿里云百炼（Bailian）的例子：

```toml
[model.replyer_1]
name = "qwen-turbo"      # 需改为百炼支持的模型名称
provider = "BAILIAN"       # 使用BAILIAN provider
```

## 配置文件详解

```ini
HOST=127.0.0.1
PORT=8000
```
这部分负责配置MaiBot监听的端口和地址。

<hr class="custom_hr"/>

```ini
#key and url
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/
DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1
CHAT_ANY_WHERE_BASE_URL=https://api.chatanywhere.tech/v1
BAILIAN_BASE_URL = https://dashscope.aliyuncs.com/compatible-mode/v1
xxxxxxx_BASE_URL=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 定义你要用的api的key(需要去对应网站申请哦)
DEEP_SEEK_KEY=
CHAT_ANY_WHERE_KEY=
SILICONFLOW_KEY=
BAILIAN_KEY = 
xxxxxxx_KEY=
```
这部分配置MaiBot使用的API服务商地址和对应的API Key。

支持自定义宏，对应的`_BASE_URL`和`_KEY`的前缀应该相同。例如，`DEEP_SEEK`服务商需要`DEEP_SEEK_BASE_URL`和`DEEP_SEEK_KEY`。