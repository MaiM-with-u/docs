# 麦麦知识库（LPMM，新版）使用说明

## 注意事项

::: danger 提醒
请仔细阅读以下注意事项，以免引起不必要的麻烦与支出
:::

**知识提取前，请确保你的文本分段良好，没有奇怪字符，否则提取结果可能很不理想**

**知识提取时，需要将文本大量输入大模型，越长的文本消耗越大，会产生一定花费**

（样例：600万字全剧情，提取选用deepseek v3 0324，消耗约40元）

**知识导入时，会大量发送请求，可能会撞到请求速度上限，请注意选用的模型（可用本地embedding模型）**

（同上样例：在本地模型下，在70分钟内我们发送了约8万条请求，在网络允许下，速度会更快）

**知识导入时，会消耗大量系统资源，建议在较好配置电脑上运行**

（同上样例，导入时10700K几乎跑满，峰值内存占用约3G）

**本知识库与旧版（暂时）不兼容**，如果需要将旧版数据库中内容迁移到新版，请重新导入

## 配置

### 一，安装环境
对于windows_x86_64平台的用户，请使用pip进行直接安装。（已经包含在MaiBot的requirements.txt中，正常应该已经安装）
对于docker用户配置完成后可以直接运行脚本（lpmm已预编译于镜像中）跳转链接[docker的lpmm食用方式](#docker的lpmm食用方式)
```bash
pip install quick_algo
```
如果你多次尝试后，发现确实没有对应你平台的版本，可以选择不使用新版知识库，或者参考下面的内容进行过手动编译。
### Windows端
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
首先安装根目录下的`requirements.txt`中的依赖
```bash
pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt --upgrade
```
随后进入`lib/quick_algo/`目录，使用**管理员权限**运行 `python build_lib.py --cleanup --cythonize --install`


### Windows(Arm)端
无数据

### Linux端
1. 首先安装gcc/g++编译器
```bash
# 根据系统，打开终端输入命令
# 基于Debian的系统（如Ubuntu、Linux Mint等）

# 更新软件包索引
sudo apt update
# 运行以下命令来安装`gcc`和`g++`：
sudo apt install build-essential


# 基于Red Hat的系统（如Fedora、CentOS、RHEL等）

# 更新软件包索引
sudo dnf check-update
# 安装`gcc`和`g++`
sudo dnf install gcc gcc-c++
# 如果使用的是`yum`，将`dnf`替换为`yum`即可


# 验证安装
# 安装完成后，可以通过以下命令验证`gcc`和`g++`是否安装成功：
gcc --version
g++ --version
# 如果安装成功，会显示`gcc`和`g++`的版本信息。

```
然后运行
```bash
python build_lib.py --cleanup --cythonize --install
```

# 配置LPMM
把`template/lpmm_config_template.toml`复制到`config/lpmm_config.toml`，按照样例配置`provider`
:::tip
实体提取、RDF提取的模型不建议使用32B以下的小模型，否则提取效果非常差而且极其可能失败
:::

## 麦麦学习知识
::: tip
知识库使用的文本必须以txt方式存储
:::
### 分段
首先，确保你的文本分段良好。

分段方式：按照同一主题，设置一个大段落，每个段落之间有一个空行。相邻的自然段将认为是一个大段落。比如下面的例子：

```
精神状态良好：形容自己精神状态良好的反讽，实际精神状态非常不稳定。

躺平：是一个网络热梗。指无论对方做出什么反应，内心都毫无波澜，对此不会有任何反应或者反抗，表示顺从心理，也表示不再热血沸腾的状态。

内卷：指一类文化模式达到了某种最终的形态以后，既没有办法稳定下来，也没有办法转变为新的形态，而只能不断地在内部变得更加复杂的现象称为“内卷化”。
现在流行成了一个字，“卷”，很多高校学生用其来指非理性的内部竞争或“被自愿”竞争。
现应用在各行各业以及各个领域中的竞争，指同行间竞相付出更多努力以争夺有限资源，从而导致个体“收益努力比”下降的现象。

凡尔赛：源自于微博上的晒富行为，形容那些故意炫耀自己、表现自己富有的人或行为，讽刺意味十足。

社死：形容某个人在公共场合出现时，因某种原因感到极其尴尬和不好意思，表现出了人们在社会交往中的种种尴尬情景。
```

随后把原始文件放到`data/lpmm_raw_data`，用`text_pre_precess.py`进行处理（实际上就是根据大段落拆分为json文件）
```bash
python text_pre_process.py
```

### 提取
在根目录运行`info_extraction.py`，提取知识
```bash
python info_extraction.py
```

### 导入
在根目录运行`import_openie.py`，导入知识
```bash
python import_openie.py
```

## 麦麦LPMM加速
:::tip
GPU加速仅适用于Linux
:::
pip包中：

如果你有cuda，你可以根据你的cuda版本安装`faiss-gpu-cu12`或者`faiss-gpu-cu11`

安装方式：
```bash
pip uninstall faiss-cpu
# 装cuda11版
pip install faiss-gpu-cu11
# 装cuda12版
pip install faiss-gpu-cu12
```

使用conda时，gpu加速仅适用于linux：
详见[faiss官方文档](https://github.com/facebookresearch/faiss/blob/main/INSTALL.md)
使用方式：
```bash
# CPU-only version
$ conda install -c pytorch faiss-cpu=1.11.0

# GPU(+CPU) version
$ conda install -c pytorch -c nvidia faiss-gpu=1.11.0

# GPU(+CPU) version with NVIDIA cuVS
$ conda install -c pytorch -c nvidia -c rapidsai -c conda-forge libnvjitlink faiss-gpu-cuvs=1.11.0

# GPU(+CPU) version using AMD ROCm not yet available
```


## docker的lpmm食用方式
首先从GitHub上拉取配置：
```bash
# github如不可用请使用镜像加速
wget https://github.com/MaiM-with-u/MaiBot/raw/refs/heads/main/template/lpmm_config_template.toml -O docker-config/mmc/lpmm_config.toml
```
然后按照样例配置`provider`
:::tip
实体提取、RDF提取的模型不建议使用32B以下的小模型，否则提取效果非常差而且极其可能失败
:::

然后创建文件夹
```bash
mkdir -p data/MaiMBot/lpmm_raw_data
```
把你的原始知识塞入lpmm_raw_data
> 格式要求见[麦麦学习知识](#麦麦学习知识)  

然后运行命令：
```bash
docker run -it -v ./data/MaiMBot:/MaiMBot/data -v ./docker-config/mmc:/MaiMBot/config -v ./docker-config/mmc/.env:/MaiMBot/.env --network maim-bot_maim_bot  --entrypoint bash sengokucola/maimbot:main "scripts/run_lpmm.sh"
```
:::tip
注意此处的`network`配置，应为你的core所在的docker网络，可使用`docker network ls`查找你的网络名称，名称后面有`maim_bot`字样的网络即为你的core所在网络  
例：  
```bash
$ docker network ls
NETWORK ID     NAME              DRIVER    SCOPE
8f5c55aec8a1   bridge            bridge    local
9e3966fa583e   host              host      local
ec92e2f103a4   maibot_maim_bot   bridge    local  # 这个就是麦麦的docker网络
cb43a6a60ed3   none              null      local
```
:::

运行完成出现`✅ All scripts completed successfully`那么你的知识库就导入成功了
