# 🔧 模型配置指南

## 简介

这个配置文件主要告诉你，麦麦使用的各个模型都是什么功能，用什么大模型比较合适。

## 模型详解

```toml
# 下面的模型有以下额外字段可以添加：
# stream = <true|false> : 用于指定模型是否是使用流式输出
# pri_in = <float> : 用于指定模型输入价格
# pri_out = <float> : 用于指定模型输出价格
# temp = <float> : 用于指定模型温度
# enable_thinking = <true|false> : 用于指定模型是否启用思考
# thinking_budget = <int> : 用于指定模型思考最长长度

[model]
model_max_output_length = 800 # 模型单次返回的最大token数
```

`model_max_output_length` 这个配置可以限制模型最大回复长度。

<hr class="custom_hr"/>

### **必填：组件模型**

这些模型是麦麦运行所**必须**的模型，但是并不直接生成回复，而是参与记忆，图像识别，关系，情感等等功能。

```toml
[model.utils] # 在麦麦的一些组件中使用的模型，例如表情包模块，取名模块，消耗量不大
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3

[model.utils_small] # 在麦麦的一些组件中使用的小模型，消耗量较大
name = "Qwen/Qwen3-8B"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0
temp = 0.7
enable_thinking = false # 是否启用思考

[model.memory_summary] # 记忆的概括模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
pri_in = 0.7
pri_out = 2.8
temp = 0.7
enable_thinking = false # 是否启用思考

[model.vlm] # 图像识别模型
name = "Pro/Qwen/Qwen2.5-VL-7B-Instruct"
provider = "SILICONFLOW"

[model.embedding] #嵌入模型
name = "BAAI/bge-m3"
provider = "SILICONFLOW"
```
- `utils`: 推荐使用V3这类**性能较强**的非推理模型，使用量不会特别大。
- `utils_small`: 推荐使用 Qwen/Qwen3-8B这类**免费的小模型**，使用量较大，但是性能要求不高。
- `memory_summary`: **记忆系统**用的，可以用一个中等大小的模型。
- `vlm`: **识图**用的，需要用一个支持图像理解的模型。
- `embedding`: **知识库**会用到，可以使用其他嵌入模型。


<hr class="custom_hr"/>

### **回复与决策模型**

这些模型负责生成回复，并进行决策。

```toml
[model.replyer_1] # 首要回复模型，还用于表达器和表达方式学习
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
temp = 0.2

[model.replyer_2] # 一般聊天模式的次要回复模型
name = "Pro/deepseek-ai/DeepSeek-R1"
provider = "SILICONFLOW"
temp = 0.7

[model.planner] #决策：负责决定麦麦该做什么，麦麦的决策模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
temp = 0.3

[model.relation] #用于处理和麦麦和其他人的关系
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
temp = 0.7
```


- `planner`: **决策模型**，负责决定麦麦的行动，在`normal_chat`中启用`enable_planner`时使用。
- `relation`: **关系模型**，在启用关系系统时，用于处理和识别与其他人的关系。

<hr class="custom_hr"/>

### **专注聊天必填模型**

这些模型是麦麦在**focus**模式需要用的，如果你不使用focus模式，可以不填写。

```toml
[model.focus_working_memory] #工作记忆模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
enable_thinking = false # 是否启用思考(qwen3 only)
pri_in = 0.7
pri_out = 2.8
temp = 0.7

[model.focus_tool_use] #工具调用模型，需要使用支持工具调用的模型
name = "Qwen/Qwen3-14B"
provider = "SILICONFLOW"
temp = 0.7
enable_thinking = false # 是否启用思考（qwen3 only）

```
- `focus_working_memory`: **工作记忆模型**，负责在专注聊天时处理和存储短期信息。
- `focus_tool_use`: **工具调用模型**，负责在需要时调用外部工具或插件。你需要选用支持工具调用（function calling）的模型。

<hr class="custom_hr"/>

### **LPMM知识库模型**

如果启用了`lpmm_knowledge`，则需要配置以下模型。

```toml
[model.lpmm_entity_extract] # 实体提取模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
temp = 0.2

[model.lpmm_rdf_build] # RDF构建模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
temp = 0.2

[model.lpmm_qa] # 问答模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
temp = 0.7
```
- `lpmm_entity_extract`: 从知识文本中**提取实体**。
- `lpmm_rdf_build`: 根据实体**构建RDF三元组**。
- `lpmm_qa`: 基于知识库进行**问答**。

## 注意事项

1. API密钥安全：
    - 妥善保管API密钥
    - 不要将含有密钥的配置文件上传至公开仓库

2. 配置修改：
    - 修改配置后需重启服务
    - 使用默认服务(硅基流动)时无需修改模型配置
    - **模型名称可能更新，需定期检查控制台模型名**

3. 其他说明：
    - 项目处于测试阶段，可能存在未知问题
    - 建议初次使用保持默认配置

4. 错误排查：
    - `401` 错误：检查对应的 `_KEY` 是否有效
    - `404` 错误：确认对应的 `_BASE_URL` 路径正确
