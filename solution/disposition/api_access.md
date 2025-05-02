# 国内通用API提供商接入指南

## 一、在.env中定义（使用阿里云百练API举例）
1.  在机器人根目录的 `.env` 文件中定义阿里云API相关环境变量：

 ```plaintext
# 阿里云API基础URL（保持默认）
ALIYUNCS_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# 阿里云API密钥（前往阿里云控制台申请）
ALIYUNCS_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  # 替换为你的实际API密钥
 ```

## 二、配置bot-config.toml
在 `config/bot-config.toml` 文件中配置模型参数：

```toml
#这个模型必须是推理模型
[model.llm_reasoning] # 一般聊天模式的推理回复模型
name = "deepseek-r1"
provider = "ALIYUNCS"
pri_in = 1.0 #模型的输入价格（非必填，可以记录消耗）
pri_out = 4.0 #模型的输出价格（非必填，可以记录消耗）
```

## 三、关键配置说明

### 环境变量引用：
系统会自动读取 `.env` 中的 `ALIYUNCS_KEY` 和 `ALIYUNCS_BASE_URL`，无需在配置文件中显式写入

### 模型选择：

```toml
# 其他模型配置示例
# name = "ep-20250313123238-h8dhj"  # 火山供应商示例（自定义推理模型名）
# provider = "VOLCENGINE"          # 火山提供商示例
```

### 价格参数：
`pri_in`/`pri_out` 根据实际计费标准填写，用于成本统计（非功能必需）

## 四、验证配置
启动机器人后查看日志，确认更改API供应商成功
- @你家bot，确认是否能成功调用并回复



## 五、注意事项

### 密钥安全：
   - 妥善保管API密钥
   - 不要将含有密钥的配置文件上传至公开仓库
### 模型版本：

*   模型名称可能更新，需定期检查控制台模型名

### 错误排查：

*   `401` 错误：检查 `ALIYUNCS_KEY` 是否有效
*   `404` 错误：确认 `ALIYUNCS_BASE_URL` 路径正确
*   超时错误：检查网络配置是否允许访问阿里云API域名