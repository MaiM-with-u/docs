# 手动编译 MaiMBot-LPMM

::: tip
如果你能直接安装quick_algo库，那么请**跳过这个步骤**，直接使用编译好的包。
:::

## 获取 MaiMBot-LPMM
```bash
git clone https://github.com/MaiM-with-u/MaiMBot-LPMM.git
```

## Windows(x86_64)

### 环境准备

1. 首先，在[C++ Build Tools](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)下载微软MSVC构建工具安装包
2. 打开安装包，会自动安装Visual Studio Installer，安装完成后，打开Visual Studio Installer
3. 选择上面的"单个组件"选项卡，搜索并选择以下组件：
   - MSVC v143 - VS 2022 C++ x64/x86 生成工具
   - Windows 10/11 SDK (根据您的电脑环境选择)
   - 适用于Windows的Cmake工具
4. 点击"安装"按钮，开始安装这些组件
5. 在[MinGW-w64 releases](https://github.com/niXman/mingw-builds-binaries/releases)下载符合您电脑环境的MinGW（注意看名称，要msvc版本的）
6. 解压到任意目录，将解压后的目录添加到环境变量中

### MSVC编译

首先安装根目录下的`requirements.txt`中的依赖

```bash
pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt --upgrade
```

随后进入`lib/quick_algo/`目录，使用**管理员权限**运行 `python build_lib.py --cleanup --cythonize --install`

```bash
cd lib/quick_algo
sudo python build_lib.py --cleanup --cythonize --install
```
::: tip
运行前请确保启用了 Sudo on windows，如果没有，就用管理员打开终端
:::
## Windows(Arm)

无数据

## Linux
### 环境准备
1. 首先安装gcc/g++编译器

基于Debian的系统（如Ubuntu、Linux Mint等）

```bash
# 更新软件包索引
sudo apt update
# 运行以下命令来安装`gcc`和`g++`：
sudo apt install build-essential
```

基于Red Hat的系统（如Fedora、CentOS、RHEL等）

```bash
# 更新软件包索引
sudo dnf check-update
# 安装`gcc`和`g++`
sudo dnf install gcc gcc-c++
# 如果使用的是`yum`，将`dnf`替换为`yum`即可
```

2. 验证安装

安装完成后，可以通过以下命令验证`gcc`和`g++`是否安装成功：

```bash
gcc --version
g++ --version
# 如果安装成功，会显示`gcc`和`g++`的版本信息。
```
### GCC编译
1. 安装依赖

进入LPMM根目录，安装对应的依赖

```bash
pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt --upgrade
```

2. 编译
进入`lib/quick_algo/`目录，运行命令`python build_lib.py --cleanup --cythonize --install`

```bash
cd lib/quick_algo
python build_lib.py --cleanup --cythonize --install
```

## MacOS
### 环境准备
1. 首先安装Clang编译环境

基于Homebrew的推荐方式：

```bash
# 安装Homebrew（如果尚未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# 安装clang
brew install llvm
```

或者直接使用Xcode命令行工具：

```bash
xcode-select --install
```

2. 安装完成后，可以通过以下命令验证clang是否安装成功：

```bash
clang --version
```
### Clang编译
1. 安装依赖
进入LPMM根目录，安装对应的依赖

```bash
pip install -i https://mirrors.aliyun.com/pypi/simple -r requirements.txt --upgrade
```

2. 进入`lib/quick_algo/`目录，运行命令`python build_lib.py --cleanup --cythonize --install`

```bash
cd lib/quick_algo
python build_lib.py --cleanup --cythonize --install
```
