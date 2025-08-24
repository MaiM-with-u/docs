# 🔧 模型配置指南

## 简介

这个配置文件主要告诉你，麦麦使用的各个模型都是什么功能，用什么大模型比较合适。

## 配置文件结构

MaiBot 现在使用独立的 `model_config.toml` 文件来配置模型和API服务商。配置文件包含以下主要部分：

- `[[api_providers]]` - API服务提供商配置
- `[[models]]` - 模型定义配置  
- `[model_task_config.*]` - 麦麦模块使用模型配置

## API服务商配置

```toml
[[api_providers]] # API服务提供商（可以配置多个）
name = "DeepSeek"                       # API服务商名称（可随意命名，在models的api-provider中需使用这个命名）
base_url = "https://api.deepseek.com/v1" # API服务商的BaseURL
api_key = "your-api-key-here"           # API密钥（请替换为实际的API密钥）
client_type = "openai"                  # 请求客户端（可选，默认值为"openai"，使用gimini等Google系模型时请配置为"gemini"）
max_retry = 2                           # 最大重试次数（单个模型API调用失败，最多重试的次数）
timeout = 30                            # API请求超时时间（单位：秒）
retry_interval = 10                     # 重试间隔时间（单位：秒）
```

### 支持的客户端类型

- `openai` - OpenAI兼容的API（默认值）
- `gemini` - Google Gemini API

### 配置示例

```toml
[[api_providers]] # SiliconFlow的API服务商配置
name = "SiliconFlow"
base_url = "https://api.siliconflow.cn/v1"
api_key = "your-siliconflow-api-key"
client_type = "openai"
max_retry = 2
timeout = 30
retry_interval = 10

[[api_providers]] # 特殊：Google的Gimini使用特殊API，与OpenAI格式不兼容，需要配置client为"gemini"
name = "Google"
base_url = "https://api.google.com/v1"
api_key = "your-google-api-key-1"
client_type = "gemini"
max_retry = 2
timeout = 30
retry_interval = 10

[[api_providers]] # 阿里 百炼 API服务商配置
name = "BaiLian"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
api_key = "your-bailian-key"
client_type = "openai"
max_retry = 2
timeout = 15
retry_interval = 5
```

<hr class="custom_hr"/>

## 模型定义配置，如何定义你的AI模型

```toml
[[models]] # 模型（可以配置多个）
model_identifier = "deepseek-chat" # 模型标识符（API服务商提供的模型标识符）
name = "deepseek-v3"               # 模型名称（可随意命名，在后面中需使用这个命名）
api_provider = "DeepSeek"          # API服务商名称（对应在api_providers中配置的服务商名称）
price_in = 2.0                     # 输入价格（用于API调用统计，单位：元/ M token）（可选，若无该字段，默认值为0）
price_out = 8.0                    # 输出价格（用于API调用统计，单位：元/ M token）（可选，若无该字段，默认值为0）
#force_stream_mode = true          # 强制流式输出模式（若模型不支持非流式输出，请取消该注释，启用强制流式输出，若无该字段，默认值为false）
```

### 模型配置字段说明

- `model_identifier`: API服务商提供的模型标识符
- `name`: 自定义的模型名称，在任务配置中引用
- `api_provider`: 对应的API服务商名称
- `price_in/price_out`: 价格信息（可选，用于统计）
- `force_stream_mode`: 强制流式输出（可选）

### 额外参数配置

```toml
[[models]]
model_identifier = "Qwen/Qwen3-8B"
name = "qwen3-8b"
api_provider = "SiliconFlow"
price_in = 0
price_out = 0
[models.extra_params] # 可选的额外参数配置
enable_thinking = false # 不启用思考
```

<hr class="custom_hr"/>

## 任务模型配置

### **必填：组件模型**

这些模型是麦麦运行所**必须**的模型，但是并不直接生成回复，而是参与记忆，图像识别，关系，情感等等功能。

```toml
[model_task_config.utils] # 在麦麦的一些组件中使用的模型，例如表情包模块，取名模块，关系模块，是麦麦必须的模型
model_list = ["siliconflow-deepseek-v3"] # 使用的模型列表，每个子项对应上面的模型名称(name)
temperature = 0.2                        # 模型温度，新V3建议0.1-0.3
max_tokens = 800                         # 最大输出token数

[model_task_config.utils_small] # 在麦麦的一些组件中使用的小模型，消耗量较大，建议使用速度较快的小模型
model_list = ["qwen3-8b","qwen3-30b"]
temperature = 0.7
max_tokens = 800
```

- `utils`: 推荐使用V3这类**性能较强**的非推理模型，使用量不会特别大。
- `utils_small`: 推荐使用 Qwen/Qwen3-8B这类**免费的小模型**，使用量较大，但是性能要求不高。

### **回复与决策模型**

这些模型负责生成回复，并进行决策。

```toml
[model_task_config.replyer] # 首要回复模型，还用于表达器和表达方式学习
model_list = ["siliconflow-deepseek-v3"]
temperature = 0.3                        # 模型温度，新V3建议0.1-0.3
max_tokens = 800

[model_task_config.planner] #决策：负责决定麦麦该什么时候回复的模型
model_list = ["siliconflow-deepseek-v3"]
temperature = 0.3
max_tokens = 800

[model_task_config.planner_small] #副决策：负责决定麦麦该做什么的模型
model_list = ["qwen3-30b"]
temperature = 0.3
max_tokens = 800

[model_task_config.emotion] #负责麦麦的情绪变化
model_list = ["qwen3-30b"]
temperature = 0.7
max_tokens = 800
```

- `replyer`: **首要回复模型**，负责生成主要回复内容
- `planner`: **决策模型**，负责决定麦麦什么时候回复
- `planner_small`: **副决策模型**，负责决定麦麦该做什么
- `emotion`: **情绪模型**，负责处理情绪变化

### **图像和语音模型**

```toml
[model_task_config.vlm] # 图像识别模型
model_list = ["qwen2.5-vl-72b"]
max_tokens = 800

[model_task_config.voice] # 语音识别模型
model_list = ["sensevoice-small"]
```

- `vlm`: **识图**用的，需要用一个支持图像理解的模型
- `voice`: **语音识别**用的，需要支持语音转文字的模型

### **工具和嵌入模型**

```toml
[model_task_config.tool_use] #工具调用模型，需要使用支持工具调用的模型
model_list = ["qwen3-30b"]
temperature = 0.7
max_tokens = 800

[model_task_config.embedding] #嵌入模型
model_list = ["bge-m3"]
```

- `tool_use`: **工具调用模型**，负责在需要时调用外部工具或插件。你需要选用支持工具调用（function calling）的模型
- `embedding`: **知识库**会用到，可以使用其他嵌入模型

### **LPMM知识库模型**

如果启用了`lpmm_knowledge`，则需要配置以下模型。

```toml
[model_task_config.lpmm_entity_extract] # 实体提取模型
model_list = ["siliconflow-deepseek-v3"]
temperature = 0.2
max_tokens = 800

[model_task_config.lpmm_rdf_build] # RDF构建模型
model_list = ["siliconflow-deepseek-v3"]
temperature = 0.2
max_tokens = 800

[model_task_config.lpmm_qa] # 问答模型
model_list = ["qwen3-30b"]
temperature = 0.7
max_tokens = 800
```

- `lpmm_entity_extract`: 从知识文本中**提取实体**
- `lpmm_rdf_build`: 根据实体**构建RDF三元组**
- `lpmm_qa`: 基于知识库进行**问答**

<hr class="custom_hr"/>



## 注意事项

1. **API密钥安全**：
    - 妥善保管API密钥
    - 不要将含有密钥的配置文件上传至公开仓库

2. **配置修改**：
    - 修改配置后需重启服务
    - 使用默认服务(硅基流动)时无需修改模型配置
    - **模型名称可能更新，需定期检查控制台模型名**

3. **配置结构**：
    - 模型必须先定义在 `[[models]]` 中，然后在 `[model_task_config.*]` 中引用
    - 模型名称必须与 `[[models]]` 中的 `name` 字段完全一致

4. **其他说明**：
    - 项目处于测试阶段，可能存在未知问题
    - 建议初次使用保持默认配置

5. **错误排查**：
    - `401` 错误：检查对应的 `api_key` 是否有效
    - `404` 错误：确认对应的 `base_url` 路径正确
    - 模型未找到：检查 `model_list` 中的模型名称是否正确
