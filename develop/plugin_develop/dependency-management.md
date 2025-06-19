# 📦 插件依赖管理系统

> 🎯 **简介**：MaiBot插件系统提供了强大的Python包依赖管理功能，让插件开发更加便捷和可靠。

## ✨ 功能概述

### 🎯 核心能力
- **声明式依赖**：插件可以明确声明需要的Python包
- **智能检查**：自动检查依赖包的安装状态
- **版本控制**：精确的版本要求管理
- **可选依赖**：区分必需依赖和可选依赖
- **自动安装**：可选的自动安装功能
- **批量管理**：生成统一的requirements文件
- **安全控制**：防止意外安装和版本冲突

### 🔄 工作流程
1. **声明依赖** → 在插件中声明所需的Python包
2. **加载检查** → 插件加载时自动检查依赖状态
3. **状态报告** → 详细报告缺失或版本不匹配的依赖
4. **智能安装** → 可选择自动安装或手动安装
5. **运行时处理** → 插件运行时优雅处理依赖缺失

## 🚀 快速开始

### 步骤1：声明依赖

在你的插件类中添加`python_dependencies`字段：

```python
from src.plugin_system import BasePlugin, PythonDependency, register_plugin

@register_plugin
class MyPlugin(BasePlugin):
    plugin_name = "my_plugin"
    plugin_description = "我的示例插件"
    
    # 声明Python包依赖
    python_dependencies = [
        PythonDependency(
            package_name="requests",
            version=">=2.25.0",
            description="HTTP请求库，用于网络通信"
        ),
        PythonDependency(
            package_name="numpy",
            version=">=1.20.0",
            optional=True,
            description="数值计算库（可选功能）"
        ),
    ]
    
    def get_plugin_components(self):
        # 返回插件组件
        return []
```

### 步骤2：处理依赖

在组件代码中优雅处理依赖缺失：

```python
class MyAction(BaseAction):
    async def execute(self, action_input, context=None):
        try:
            import requests
            # 使用requests进行网络请求
            response = requests.get("https://api.example.com")
            return {"status": "success", "data": response.json()}
        except ImportError:
            return {
                "status": "error",
                "message": "功能不可用：缺少requests库",
                "hint": "请运行: pip install requests>=2.25.0"
            }
```

### 步骤3：检查和管理

使用依赖管理API：

```python
from src.plugin_system import plugin_manager

# 检查所有插件的依赖状态
result = plugin_manager.check_all_dependencies()
print(f"检查了 {result['total_plugins_checked']} 个插件")
print(f"缺少必需依赖的插件: {result['plugins_with_missing_required']} 个")

# 生成requirements文件
plugin_manager.generate_plugin_requirements("plugin_requirements.txt")
```

## 📚 详细教程

### PythonDependency 类详解

`PythonDependency`是依赖声明的核心类：

```python
PythonDependency(
    package_name="requests",     # 导入时的包名
    version=">=2.25.0",         # 版本要求
    optional=False,             # 是否为可选依赖
    description="HTTP请求库",    # 依赖描述
    install_name=""             # pip安装时的包名（可选）
)
```

#### 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `package_name` | str | ✅ | Python导入时使用的包名（如`requests`） |
| `version` | str | ❌ | 版本要求，支持pip格式（如`>=1.0.0`, `==2.1.3`） |
| `optional` | bool | ❌ | 是否为可选依赖，默认`False` |
| `description` | str | ❌ | 依赖的用途描述 |
| `install_name` | str | ❌ | pip安装时的包名，默认与`package_name`相同 |

#### 版本格式示例

```python
# 常用版本格式
PythonDependency("requests", ">=2.25.0")           # 最小版本
PythonDependency("numpy", ">=1.20.0,<2.0.0")       # 版本范围
PythonDependency("pillow", "==8.3.2")              # 精确版本
PythonDependency("scipy", ">=1.7.0,!=1.8.0")       # 排除特定版本
```

#### 特殊情况处理

**导入名与安装名不同的包：**

```python
PythonDependency(
    package_name="PIL",        # import PIL
    install_name="Pillow",     # pip install Pillow
    version=">=8.0.0"
)
```

**可选依赖示例：**

```python
python_dependencies = [
    # 必需依赖 - 核心功能
    PythonDependency(
        package_name="requests",
        version=">=2.25.0",
        description="HTTP库，插件核心功能必需"
    ),
    
    # 可选依赖 - 增强功能
    PythonDependency(
        package_name="numpy",
        version=">=1.20.0",
        optional=True,
        description="数值计算库，用于高级数学运算"
    ),
    PythonDependency(
        package_name="matplotlib",
        version=">=3.0.0",
        optional=True,
        description="绘图库，用于数据可视化功能"
    ),
]
```

### 依赖检查机制

系统在以下时机会自动检查依赖：

1. **插件加载时**：检查插件声明的所有依赖
2. **手动调用时**：通过API主动检查
3. **运行时检查**：在组件执行时动态检查

#### 检查结果状态

| 状态 | 描述 | 处理建议 |
|------|------|----------|
| `no_dependencies` | 插件未声明任何依赖 | 无需处理 |
| `ok` | 所有依赖都已满足 | 正常使用 |
| `missing_optional` | 缺少可选依赖 | 部分功能不可用，考虑安装 |
| `missing_required` | 缺少必需依赖 | 插件功能受限，需要安装 |

## 🎯 最佳实践

### 1. 依赖声明原则

#### ✅ 推荐做法

```python
python_dependencies = [
    # 明确的版本要求
    PythonDependency(
        package_name="requests",
        version=">=2.25.0,<3.0.0",  # 主版本兼容
        description="HTTP请求库，用于API调用"
    ),
    
    # 合理的可选依赖
    PythonDependency(
        package_name="numpy",
        version=">=1.20.0",
        optional=True,
        description="数值计算库，用于数据处理功能"
    ),
]
```

#### ❌ 避免的做法

```python
python_dependencies = [
    # 过于宽泛的版本要求
    PythonDependency("requests"),  # 没有版本限制
    
    # 过于严格的版本要求  
    PythonDependency("numpy", "==1.21.0"),  # 精确版本过于严格
    
    # 缺少描述
    PythonDependency("matplotlib", ">=3.0.0"),  # 没有说明用途
]
```

### 2. 错误处理模式

#### 优雅降级模式

```python
class SmartAction(BaseAction):
    async def execute(self, action_input, context=None):
        # 检查可选依赖
        try:
            import numpy as np
            # 使用numpy的高级功能
            return await self._advanced_processing(action_input, np)
        except ImportError:
            # 降级到基础功能
            return await self._basic_processing(action_input)
    
    async def _advanced_processing(self, input_data, np):
        """使用numpy的高级处理"""
        result = np.array(input_data).mean()
        return {"result": result, "method": "advanced"}
    
    async def _basic_processing(self, input_data):
        """基础处理（不依赖外部库）"""
        result = sum(input_data) / len(input_data)
        return {"result": result, "method": "basic"}
```

## 🔧 使用API

### 检查依赖状态

```python
from src.plugin_system import plugin_manager

# 检查所有插件依赖（仅检查，不安装）
result = plugin_manager.check_all_dependencies(auto_install=False)

# 检查并自动安装缺失的必需依赖
result = plugin_manager.check_all_dependencies(auto_install=True)
```

### 生成requirements文件

```python
# 生成包含所有插件依赖的requirements文件
plugin_manager.generate_plugin_requirements("plugin_requirements.txt")
```

### 获取依赖状态报告

```python
# 获取详细的依赖检查报告
result = plugin_manager.check_all_dependencies()
for plugin_name, status in result['plugin_status'].items():
    print(f"插件 {plugin_name}: {status['status']}")
    if status['missing']:
        print(f"  缺失必需依赖: {status['missing']}")
    if status['optional_missing']:
        print(f"  缺失可选依赖: {status['optional_missing']}")
```

## 🛡️ 安全考虑

### 1. 自动安装控制
- 🛡️ **默认手动**: 自动安装默认关闭，需要明确启用
- 🔍 **依赖审查**: 安装前会显示将要安装的包列表
- ⏱️ **超时控制**: 安装操作有超时限制（5分钟）

### 2. 权限管理
- 📁 **环境隔离**: 推荐在虚拟环境中使用
- 🔒 **版本锁定**: 支持精确的版本控制
- 📝 **安装日志**: 记录所有安装操作

## 📊 故障排除

### 常见问题

1. **依赖检查失败**
   ```python
   # 手动检查包是否可导入
   try:
       import package_name
       print("包可用")
   except ImportError:
       print("包不可用，需要安装")
   ```

2. **版本冲突**
   ```python
   # 检查已安装的包版本
   import package_name
   print(f"当前版本: {package_name.__version__}")
   ```

3. **安装失败**
   ```python
   # 查看安装日志
   from src.plugin_system import dependency_manager
   result = dependency_manager.get_install_summary()
   print("安装日志:", result['install_log'])
   print("失败详情:", result['failed_installs'])
   ```

## 🔗 相关文档

- [🚀 快速开始指南](quick-start.md) - 创建你的第一个插件
- [⚡ Action组件详解](action-components.md) - Action开发指南
- [💻 Command组件详解](command-components.md) - Command开发指南
- [📋 开发规范](development-standards.md) - 代码规范和最佳实践

---

通过依赖管理系统，你的插件将更加健壮和易于维护。开始使用这些功能让你的插件开发更加高效吧！ 🚀 