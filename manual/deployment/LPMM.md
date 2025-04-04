# 麦麦知识库（非0.6.0版，现在未启用）（新版）使用说明

## 注意事项

::: warning
请仔细阅读以下注意事项，以免引起不必要的麻烦与支出
:::

**知识提取前，请确保你的文本分段良好，没有奇怪字符，否则提取结果可能很不理想**

**知识提取时，需要将文本大量输入大模型，越长的文本消耗越大，会产生一定花费**

（样例：600万字全剧情，提取选用deepseek v3 0324，消耗约40元）

**知识导入时，会大量发送请求，可能会撞到请求速度上限，请注意选用的模型（可用本地embedding模型）**

（同上样例：在本地模型下，在70分钟内我们发送了约8万条请求，在网络允许下，速度会更快）

**知识导入时，会消耗大量系统资源，建议在较好配置电脑上运行**

（同上样例，导入时10700K几乎跑满，峰值内存占用约3G）

**本知识库与旧版（暂时）不兼容**

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
首先安装gcc/g++编译器
然后打开`src/plugins/knowledge/lib/quick_algo`下面的`setup.py`，修改编译参数如下
```python
ext_modules = [
    Extension(
        "pagerank",
        sources=["pagerank.pyx", "pr.c"],
        include_dirs=["."],
        libraries=[],
        language="c",
        extra_compile_args=[
            '-O3',
            '-mavx',
            '-fopenmp',
            '-march=native'
        ],
        extra_link_args=[
            '-fopenmp'
        ]
    )
]
```
随后在你的环境（虚拟环境或者本机环境）中进入`src/plugins/knowledge/lib/quick_algo`目录运行`python setup.py build_ext --inplace`并等待编译完成

# 配置LPMM
把`template/lpmm_config_template.toml`复制到`config/lpmm_config.toml`，按照样例配置`provider`
:::tip
实体提取，RDF提取的模型不建议使用32B以下的小模型，否则提取效果非常差而且及其可能失败
:::

## 麦麦学习知识
### 分段
首先，确保你的文本分段良好。

分段方式：按照同一主题，设置一个大段落，每个段落之间有一个空行。比如下面的例子：

```
精神状态良好：形容自己精神状态良好的反讽，实际精神状态非常不稳定。

躺平：是一个网络热梗。指无论对方做出什么反应，内心都毫无波澜，对此不会有任何反应或者反抗，表示顺从心理，也表示不再热血沸腾的状态。

内卷：指一类文化模式达到了某种最终的形态以后，既没有办法稳定下来，也没有办法转变为新的形态，而只能不断地在内部变得更加复杂的现象称为“内卷化”。
现在流行成了一个字，“卷”，很多高校学生用其来指非理性的内部竞争或“被自愿”竞争。
现应用在各行各业以及各个领域中的竞争，指同行间竞相付出更多努力以争夺有限资源，从而导致个体“收益努力比”下降的现象。

凡尔赛：源自于微博上的晒富行为，形容那些故意炫耀自己、表现自己富有的人或行为，讽刺意味十足。

社死：形容某个人在公共场合出现时，因某种原因感到极其尴尬和不好意思，表现出了人们在社会交往中的种种尴尬情景。
```

随后把原始文件改名为`raw.txt`放到`src/plugins/knowledge/src/scripts`，用`text_pre_precess.py`进行处理（实际上就是根据大段落拆分为json文件）

### 提取
将上一步中生成的`import.json`放到根目录的`data`文件夹下（存表情包的那个），在根目录下运行`info_extraction.py`，等待结束后，在根目录运行`import_openie.py`，等待知识库生成。

### 使用
将`bot_config.toml`中的`response`从`heart_flow`改为`reasoning`以启用新的知识库

## 麦麦LPMM加速
pip包中：

如果你有不错的GPU，可以安装faiss-gpu版

如果你有cuda，你甚至可以安装faiss-cu版

安装方式暂时略