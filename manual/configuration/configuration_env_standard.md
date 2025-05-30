# 🔧 配置指南

## 简介

本页面将会告诉你如何通过修改.env文件，配置你的apikey，以及新增其他服务商的apikey


## API配置说明

`.env` 和 `bot_config.toml` 中的API配置关系如下：

### 在.env中定义API凭证

```ini
# API凭证配置
SILICONFLOW_KEY=your_key        # 硅基流动API密钥
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/  # 硅基流动API地址
DEEP_SEEK_KEY=your_key          # DeepSeek API密钥
DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1  # DeepSeek API地址

#或者你也可以自定义使用其他厂商的api，ALIYUNCS可以替换成任意字段
ALIYUNCS_KEY=your_key
ALIYUNCS_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1 # 阿里云API地址
```

### 在bot_config.toml中引用API凭证

```toml
[model.llm_reasoning]
name = "Pro/deepseek-ai/DeepSeek-R1"
provider = "SILICONFLOW"         # 引用.env中定义的宏
```

如需切换到其他API服务，只需修改引用：

```toml
[model.llm_reasoning]
name = "deepseek-reasoner"       # 改成对应的模型名称，这里为DeepseekR1
provider = "DEEP_SEEK"           # 使用DeepSeek provider
```

另一个使用阿里云的例子：

```toml
#这个模型必须是推理模型
[model.llm_reasoning] # 一般聊天模式的推理回复模型
name = "deepseek-r1"
provider = "ALIYUNCS"
pri_in = 1.0 #模型的输入价格（非必填，可以记录消耗）
pri_out = 4.0 #模型的输出价格（非必填，可以记录消耗）
```


## 配置文件详解

```ini
HOST=127.0.0.1
PORT=8000
```
这部分负责配置MaiBot监听的端口和地址

<hr class="custom_hr"/>

```ini
#key and url
CHAT_ANY_WHERE_BASE_URL=https://api.chatanywhere.tech/v1
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/
DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1

# 定义你要用的api的key(需要去对应网站申请哦)
DEEP_SEEK_KEY=
CHAT_ANY_WHERE_KEY=
SILICONFLOW_KEY=

```
这部分配置MaiBot使用的API以及API_key

支持自定义宏，对应的BASE_URL和KEY的前缀应该相同

比如，`DEEP_SEEK`的`BASE_URL`为`DEEP_SEEK_BASE_URL`，`KEY`为`DEEP_SEEK_KEY`

详细内容参考上文。