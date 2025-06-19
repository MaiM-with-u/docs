# LLM API

LLM API模块提供与大语言模型交互的功能，让插件能够使用系统配置的LLM模型进行内容生成。

## 导入方式

```python
from src.plugin_system.apis import llm_api
```

## 主要功能

### 1. 模型管理

#### `get_available_models() -> Dict[str, Any]`
获取所有可用的模型配置

**返回：**
- `Dict[str, Any]`：模型配置字典，key为模型名称，value为模型配置

**示例：**
```python
models = llm_api.get_available_models()
for model_name, model_config in models.items():
    print(f"模型: {model_name}")
    print(f"配置: {model_config}")
```

### 2. 内容生成

#### `generate_with_model(prompt, model_config, request_type="plugin.generate", **kwargs)`
使用指定模型生成内容

**参数：**
- `prompt`：提示词
- `model_config`：模型配置（从 get_available_models 获取）
- `request_type`：请求类型标识
- `**kwargs`：其他模型特定参数，如temperature、max_tokens等

**返回：**
- `Tuple[bool, str, str, str]`：(是否成功, 生成的内容, 推理过程, 模型名称)

**示例：**
```python
models = llm_api.get_available_models()
default_model = models.get("default")

if default_model:
    success, response, reasoning, model_name = await llm_api.generate_with_model(
        prompt="请写一首关于春天的诗",
        model_config=default_model,
        temperature=0.7,
        max_tokens=200
    )
    
    if success:
        print(f"生成内容: {response}")
        print(f"使用模型: {model_name}")
```

## 使用示例

### 1. 基础文本生成

```python
from src.plugin_system.apis import llm_api

async def generate_story(topic: str):
    """生成故事"""
    models = llm_api.get_available_models()
    model = models.get("default")
    
    if not model:
        return "未找到可用模型"
    
    prompt = f"请写一个关于{topic}的短故事，大约100字左右。"
    
    success, story, reasoning, model_name = await llm_api.generate_with_model(
        prompt=prompt,
        model_config=model,
        request_type="story.generate",
        temperature=0.8,
        max_tokens=150
    )
    
    return story if success else "故事生成失败"
```

### 2. 在Action中使用LLM

```python
from src.plugin_system.base import BaseAction

class LLMAction(BaseAction):
    async def execute(self, action_data, chat_stream):
        # 获取用户输入
        user_input = action_data.get("user_message", "")
        intent = action_data.get("intent", "chat")
        
        # 获取模型配置
        models = llm_api.get_available_models()
        model = models.get("default")
        
        if not model:
            return {"success": False, "error": "未配置LLM模型"}
        
        # 构建提示词
        prompt = self.build_prompt(user_input, intent)
        
        # 生成回复
        success, response, reasoning, model_name = await llm_api.generate_with_model(
            prompt=prompt,
            model_config=model,
            request_type=f"plugin.{self.plugin_name}",
            temperature=0.7
        )
        
        if success:
            return {
                "success": True,
                "response": response,
                "model_used": model_name,
                "reasoning": reasoning
            }
        
        return {"success": False, "error": response}
    
    def build_prompt(self, user_input: str, intent: str) -> str:
        """构建提示词"""
        base_prompt = "你是一个友善的AI助手。"
        
        if intent == "question":
            return f"{base_prompt}\n\n用户问题：{user_input}\n\n请提供准确、有用的回答："
        elif intent == "chat":
            return f"{base_prompt}\n\n用户说：{user_input}\n\n请进行自然的对话："
        else:
            return f"{base_prompt}\n\n用户输入：{user_input}\n\n请回复："
```

### 3. 多模型对比

```python
async def compare_models(prompt: str):
    """使用多个模型生成内容并对比"""
    models = llm_api.get_available_models()
    results = {}
    
    for model_name, model_config in models.items():
        success, response, reasoning, actual_model = await llm_api.generate_with_model(
            prompt=prompt,
            model_config=model_config,
            request_type="comparison.test"
        )
        
        results[model_name] = {
            "success": success,
            "response": response,
            "model": actual_model,
            "reasoning": reasoning
        }
    
    return results
```

### 4. 智能对话插件

```python
class ChatbotPlugin(BasePlugin):
    async def handle_action(self, action_data, chat_stream):
        user_message = action_data.get("message", "")
        
        # 获取历史对话上下文
        context = self.get_conversation_context(chat_stream)
        
        # 构建对话提示词
        prompt = self.build_conversation_prompt(user_message, context)
        
        # 获取模型配置
        models = llm_api.get_available_models()
        chat_model = models.get("chat", models.get("default"))
        
        if not chat_model:
            return {"success": False, "message": "聊天模型未配置"}
        
        # 生成回复
        success, response, reasoning, model_name = await llm_api.generate_with_model(
            prompt=prompt,
            model_config=chat_model,
            request_type="chat.conversation",
            temperature=0.8,
            max_tokens=500
        )
        
        if success:
            # 保存对话历史
            self.save_conversation(chat_stream, user_message, response)
            
            return {
                "success": True,
                "reply": response,
                "model": model_name
            }
        
        return {"success": False, "message": "回复生成失败"}
    
    def build_conversation_prompt(self, user_message: str, context: list) -> str:
        """构建对话提示词"""
        prompt = "你是一个有趣、友善的聊天机器人。请自然地回复用户的消息。\n\n"
        
        # 添加历史对话
        if context:
            prompt += "对话历史：\n"
            for msg in context[-5:]:  # 只保留最近5条
                prompt += f"用户: {msg['user']}\n机器人: {msg['bot']}\n"
            prompt += "\n"
        
        prompt += f"用户: {user_message}\n机器人: "
        return prompt
```

## 模型配置说明

### 常用模型类型
- `default`：默认模型
- `chat`：聊天专用模型
- `creative`：创意生成模型
- `code`：代码生成模型

### 配置参数
LLM模型支持的常用参数：
- `temperature`：控制输出随机性（0.0-1.0）
- `max_tokens`：最大生成长度
- `top_p`：核采样参数
- `frequency_penalty`：频率惩罚
- `presence_penalty`：存在惩罚

## 注意事项

1. **异步操作**：LLM生成是异步的，必须使用`await`
2. **错误处理**：生成失败时返回False和错误信息
3. **配置依赖**：需要正确配置模型才能使用
4. **请求类型**：建议为不同用途设置不同的request_type
5. **性能考虑**：LLM调用可能较慢，考虑超时和缓存
6. **成本控制**：注意控制max_tokens以控制成本 