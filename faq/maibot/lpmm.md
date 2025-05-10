# MaiBot Q&A

这个页面用于记录LPMM相关的问题

## LPMM有关问题

### LPMM知识库导入时出现ConnectionError

检查你的`config/lpmm_config.toml`文件，确保正确填入了硅基流动的API密钥。

### LPMM知识库导入时出现：Error 429 

如果LPMM导入知识库时出现了429错误

出现类似于：
```bash
 | LPMM | 实体提取失败，错误信息：Error code: 429 - {'message': 'Request was rejected due to rate limiting. Details: TPM limit reached.', 'data': None}
```
说明你在短时间内请求了过多的API。请稍等片刻再试。

或者氪金上硅基流动的Pro模型或者使用DeepSeek官方模型

### LPMM知识库导入时出现：实体提取失败，错误信息：

如果是出现`实体提取结果为空`，或者`RDF提取结果格式错误`
属于正常现象，因为LLM不会每次都返回正确的数据