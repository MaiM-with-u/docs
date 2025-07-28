# LLM API

LLM API模块提供与大语言模型交互的功能，让插件能够使用系统配置的LLM模型进行内容生成。

## 导入方式

```python
from src.plugin_system.apis import llm_api
# 或者
from src.plugin_system import llm_api
```

## 主要功能

### 1. 查询可用模型
```python
def get_available_models() -> Dict[str, Any]:
```
获取所有可用的模型配置。

**Return：**
- `Dict[str, Any]`：模型配置字典，key为模型名称，value为模型配置。

### 2. 使用模型生成内容
```python
async def generate_with_model(
    prompt: str, model_config: Dict[str, Any], request_type: str = "plugin.generate", **kwargs
) -> Tuple[bool, str]:
```
使用指定模型生成内容。

**Args:**
- `prompt`：提示词。
- `model_config`：模型配置（从 `get_available_models` 获取）。
- `request_type`：请求类型标识，默认为 `"plugin.generate"`。
- `**kwargs`：其他模型特定参数，如 `temperature`、`max_tokens` 等。

**Return：**
- `Tuple[bool, str]`：返回一个元组，第一个元素表示是否成功，第二个元素为生成的内容或错误信息。