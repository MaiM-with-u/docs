# 🔧 配置指南

## 简介

这个配置文件主要告诉你，麦麦使用的各个模型都是什么功能，是用什么大模型比较合适

## 模型详解

```toml
#下面的模型若使用硅基流动则不需要更改，使用ds官方则改成.env自定义的宏，使用自定义模型则选择定位相似的模型自己填写

# 额外字段
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

`model_max_output_length` 这个配置可以限制模型最大回复长度

<hr class="custom_hr"/>

```toml
[model.utils] # 在麦麦的一些组件中使用的模型，例如表情包模块，取名模块，消耗量不大
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3

[model.utils_small] # 在麦麦的一些组件中使用的小模型，消耗量较大
# 强烈建议使用免费的小模型
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
pri_in = 0.35
pri_out = 0.35

#嵌入模型
[model.embedding]
name = "BAAI/bge-m3"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0

```

这些模型是麦麦运行所**必须**的模型，但是并不直接生成回复
这意味着如果不配置，麦麦将**无法**正常工作。

这些模型**不会直接影响**麦麦回复的内容，会参与记忆，图像识别，关系，情感等等功能

`model.utils`推荐使用V3这类**性能较强**的非推理模型，使用量不会特别大。不建议用推理模型（比如不建议R1）

`model.utils_small`推荐使用 Qwen/Qwen3-8B或者 Qwen/Qwen2.5-7B 这类**免费的小模型**，使用量较大，但是性能要求不高。不建议用推理模型


`model.memory_summary`是给**记忆系统**用的，可以用一个不大不小的模型，不建议用推理模型

`model.vlm` 识别图像用的，麦麦所有接收到的图像都通过这个模型理解，你需要用一个**可以识图**的模型

`model.embedding` 知识库会用到，可以用其他**嵌入**模型

<hr class="custom_hr"/>

```toml
[model.normal_chat_1] # 一般聊天模式的首要回复模型，推荐使用 推理模型
name = "Pro/deepseek-ai/DeepSeek-R1"
provider = "SILICONFLOW"
pri_in = 4.0 #模型的输入价格（非必填，可以记录消耗）
pri_out = 16.0 #模型的输出价格（非必填，可以记录消耗）
temp = 0.7

[model.normal_chat_2] # 一般聊天模式的次要回复模型，推荐使用 非推理模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3
```
这些模型是麦麦在一般水群**normal**模式需要用的，如果你不使用normal模式，可以不填写

这两个模型会根据配置的比例随机进行**回复生成**


<hr class="custom_hr"/>

```toml
[model.focus_working_memory] #工作记忆模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
enable_thinking = false # 是否启用思考(qwen3 only)
pri_in = 0.7
pri_out = 2.8
temp = 0.7

[model.focus_chat_mind] #聊天规划：认真聊天时,生成麦麦对聊天的规划想法
name = "Pro/deepseek-ai/DeepSeek-V3"
# name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
# enable_thinking = false # 是否启用思考
pri_in = 2
pri_out = 8
temp = 0.3

[model.focus_tool_use] #工具调用模型，需要使用支持工具调用的模型
name = "Qwen/Qwen3-14B"
provider = "SILICONFLOW"
pri_in = 0.5
pri_out = 2
temp = 0.7
enable_thinking = false # 是否启用思考（qwen3 only）

[model.focus_planner] #决策：认真聊天时,负责决定麦麦该做什么
name = "Pro/deepseek-ai/DeepSeek-V3"
# name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
# enable_thinking = false # 是否启用思考(qwen3 only)
pri_in = 2
pri_out = 8
temp = 0.3

#表达器模型，用于表达麦麦的想法，生成最终回复，对语言风格影响极大
#也用于表达方式学习
[model.focus_expressor]
name = "Pro/deepseek-ai/DeepSeek-V3"
# name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
# enable_thinking = false # 是否启用思考(qwen3 only)
pri_in = 2
pri_out = 8
temp = 0.3

#自我识别模型，用于自我认知和身份识别
[model.focus_self_recognize]
# name = "Pro/deepseek-ai/DeepSeek-V3"
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
pri_in = 0.7
pri_out = 2.8
temp = 0.7
enable_thinking = false # 是否启用思考(qwen3 only)

```
这些模型是麦麦在专注聊天**focus**模式需要用的，如果你不使用focus模式，可以不填写



## 注意事项

1. API密钥安全：
    - 妙善保管API密钥
    - 不要将含有密钥的配置文件上传至公开仓库

2. 配置修改：
    - 修改配置后需重启服务
    - 使用默认服务(硅基流动)时无需修改模型配置
    - **模型名称可能更新，需定期检查控制台模型名**

3. 其他说明：
    - 项目处于测试阶段，可能存在未知问题
    - 建议初次使用保持默认配置

4. 错误排查：
    - `401` 错误：检查 `xxxxxxxxx_KEY` 是否有效
    - `404` 错误：确认 `xxxxxxxxx_BASE_URL` 路径正确
