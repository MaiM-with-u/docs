# 麦麦知识库（新版）使用说明

## 注意事项

::: warning
请仔细阅读以下注意事项，以免引起不必要的麻烦与支出
:::

**知识提取前，请确保你的文本分段良好，没有奇怪字符，否则提取结果可能很不理想**

**知识提取时，需要将文本大量输入大模型，越长的文本消耗越大，会产生一定花费**

（样例：600万字全剧情，提取选用deepseek v3 0324，消耗约40元）

**知识导入时，会大量发送请求，可能会撞到请求速度上限，请注意选用的 模型**

（同上样例：在本地模型下，在70分钟内我们发送了约8万条请求，在网络允许下，速度会更快）

**知识导入时，会消耗大量系统资源，建议在较好配置电脑上运行**

（同上样例，导入时10700K几乎跑满，峰值内存占用约3G）


## 配置

### 一，获取必要的文件
如果你使用的平台在[github release](https://github.com/MaiM-with-u/MaiMBot-LPMM/releases)中已经有编译好的包，推荐直接下载进行部署。

对于开发者/没有已经编译好的包的用户而言，我们建议您自行编译

### Windows(x86_64)端
#### 环境准备
1. 首先，在[C++ Build Tools](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)下载微软MSVC构建工具安装包
2. 打开安装包，会自动安装Visual Studio Installer，安装完成后，打开Visual Studio Installer
3. 选择上面的“单个组件”选项卡，搜索并选择以下组件：
- MSVC v143 - VS 2022 C++ x64/x86 生成工具
- Windows 10/11 SDK (根据您的电脑环境选择)
- 适用于Windows的Cmake工具
4. 点击“安装”按钮，开始安装这些组件
5. 在[MinGW-w64 releases](https://github.com/niXman/mingw-builds-binaries/releases)下载符合您电脑环境的MinGW（注意看名称，要msvc版本的）
6. 解压到任意目录，将解压后的目录添加到环境变量中


#### MSVC编译
进入ib/quick_algo/目录，使用**管理员权限**运行 `python setup.py build_ext --inplace`


### Windows(Arm)端
无数据

### Linux端
待完成

## 麦麦学习知识
待完成