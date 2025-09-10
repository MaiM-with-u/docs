# 📦 Windows 部署

::: warning
**本教程为部署到QQ平台的教程，不代表其他平台的部署方式相同**
:::

::: tip
知识库使用说明在[这里](/manual/usage/features/lpmm)
:::

::: info
本教程推荐使用 [uv](https://docs.astral.sh/uv/) 作为 Python 包管理器，它提供了更快的包安装速度和更好的依赖管理体验。当然，传统的 pip 和 conda 方式依然可用。
:::

## 系统要求
python >= 3.10

OS: Windows10 或 Windows11

uv >= 0.1.0 (推荐使用最新版本)

## 部署步骤

### 一、获取必要的文件

1. 创建 `MaiM-with-u` 文件夹并进入
2. 通过 git clone 将 [麦麦 repo](https://github.com/MaiM-with-u/MaiBot) clone 到本地
3. 通过 git clone 将 [MaiBot-Napcat-Adapter](https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter) clone 到本地
```shell
mkdir MaiM-with-u
cd MaiM-with-u
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter.git

```

### 二、环境配置

#### 安装 uv (推荐)

首先安装 uv 包管理器，可以通过以下命令快速安装：
```shell
# 使用 pip 安装 uv
pip install uv
```
或者从 [uv官方文档](https://docs.astral.sh/uv/getting-started/installation/) 下载安装包进行安装。

::: tip
使用 uv 时需要先运行 `uv venv` 创建虚拟环境，然后使用 `uv pip install` 安装依赖，或者直接使用 `uv run` 命令来自动管理虚拟环境。
:::

#### Conda 版 (传统方式)

假定你已经安装好了Conda，只需要创建一个python**版本大于等于3.10**的虚拟环境即可。
```shell
conda create -n MaiBotEnv python=3.12
conda activate MaiBotEnv
```

#### 虚拟环境版 (传统方式)

1. 首先，在[官网](https://www.python.org/)下载python，并安装**大于等于3.10的版本**并添加系统变量。  
2. 随后在 `MaiM-with-u` 文件夹创建Python虚拟环境并激活
```shell
python -m venv MaiBot\venv
.\MaiBot\venv\Scripts\activate
```

### 三、依赖安装

#### 使用 uv 安装依赖 (推荐)

1. 进入下载的麦麦repo文件夹，创建虚拟环境并安装依赖
```shell
cd MaiBot
uv venv
uv pip install -r .\requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
```
::: tip
`uv venv` 创建虚拟环境，`uv pip install` 在该环境中安装依赖。如果你在安装过程中发现`quick_algo`安装失败，请参考[LPMM 使用说明](/manual/usage/features/lpmm)中手动编译的部分
:::

2. 随后回到上一级文件夹（此处为MaiM-with-u），再进入MaiBot-NapCat-Adapter文件夹，安装依赖
```shell
cd ..
cd MaiBot-Napcat-Adapter
uv venv
uv pip install -r .\requirements.txt -i https://mirrors.aliyun.com/pypi/simple --upgrade
```

#### 使用 pip 安装依赖 (传统方式)

1. 进入下载的麦麦repo文件夹
2. pip安装所需依赖
```shell
cd MaiBot
pip install -i https://mirrors.aliyun.com/pypi/simple -r .\requirements.txt --upgrade
```
::: tip
如果你在这里发现`quick_algo`安装失败，请参考[LPMM 使用说明](/manual/usage/features/lpmm)中手动编译的部分
:::
3. 随后回到上一级文件夹（此处为MaiM-with-u），再进入MaiBot-NapCat-Adapter文件夹，安装依赖
```shell
cd ..
cd MaiBot-Napcat-Adapter
pip install -i https://mirrors.aliyun.com/pypi/simple -r .\requirements.txt --upgrade
```
### 四、Napcat adapter 部署

打开你的文件夹（这里是`Maim-with-u`文件夹下的`MaiBot-Napcat-Adapter`文件夹），找到`template`下的`template_config.toml`复制到Adapter的根目录，改名为`config.toml`

<hr class="custom_hr"/>

最终部署完成后的文件夹结构应该类似这样：
```
Maim-with-u
├── MaiBot
│   ├── changelogs
│   ├── config
│   ├── data
│   ├── depends-data
│   ├── src
│   │   └── ...
│   └── template
└── MaiBot-Napcat-Adapter
    └── ...
```

### 五、Napcat 部署

- 请参考NapCatQQ文档：[Shell版](https://www.napcat.wiki/guide/boot/Shell)、[Framework版](https://www.napcat.wiki/guide/boot/Framework),任选一种即可

### 六、配置 MaiBot 和 Adapter

#### MaiBot配置
1. 在`MaiBot`文件夹中新建一个`config`文件夹，手动复制`template`文件夹中的`bot_config_template.toml`和`model_config_template.toml`到`config`目录下并改名为`bot_config.toml`和`model_config.toml`
2. 然后手动复制`template`文件夹中的`template.env`到根目录并重命名为`.env`
3. 打开`.env`并修改PORT为8000
4. 剩余的内容参考[配置指南](/manual/configuration/index)

#### MaiBot Napcat adapter 配置

1. 在Napcat中新建`websocket客户端`并设置反向代理的url（这里以`ws://localhost:8095/`为例）
> [!IMPORTANT]
> 配置示例：
> ![](/images/napcat_websockets_client.png)
2. 打开`MaiBot-Napcat-Adapter`文件夹下的`config.toml`，配置`[Napcat_Server]`、`[MaiBot_Server]`、`[Napcat]`字段
    - `[Napcat_Server]`字段的port,应该与Napcat设置的反向代理的url相同（这里是8095）
    - `[Napcat_Server]`字段的heartbeat,应该与Napcat设置的反向代理的心跳间隔相同（注意，Napcat中的间隔为毫秒，填入时请转化为秒，这里是30）
    - `[MaiBot_Server]`字段的port,应该与麦麦本体的`.env`中的`PORT`相同（此处为8000）

```ini
HOST=127.0.0.1
PORT=8000
```
麦麦主程序.env文件中的这部分负责配置MaiBot监听的端口和地址。


```toml
[Napcat_Server] # Napcat连接的ws服务设置
host = "localhost" # Napcat设定的主机地址
port = 8095        # Napcat设定的端口
heartbeat = 30     # 与Napcat设置的心跳相同（按秒计）

[MaiBot_Server] # 连接麦麦的ws服务设置
platform_name = "qq" # 标识adapter的名称（必填）
host = "localhost"   # 麦麦在.env文件中设置的主机地址，即HOST字段
port = 8000          # 麦麦在.env文件中设置的端口，即PORT字段
```
3. 其余字段请参考 Napcat Adapter 的[配置指南](/manual/adapters/napcat)

### 七、运行

#### 使用 uv 运行 (推荐)

1. 首先启动Napcat

2. 随后进入麦麦本体的文件夹，使用 uv 运行
```shell
cd MaiBot
uv run python .\bot.py
```
3. 然后打开一个新的窗口，进入Adapter的文件夹，运行
```shell
cd MaiBot-Napcat-Adapter
uv run python .\main.py
```

::: tip
`uv run` 会自动激活项目的虚拟环境并运行命令，无需手动激活虚拟环境。
:::

#### 使用传统方式运行

1. 首先启动Napcat

2. 随后进入麦麦本体的文件夹，运行
```shell
# 因为已经激活虚拟环境，无需再次激活
# .\venv\Scripts\activate
python .\bot.py
```
3. 然后打开一个新的窗口，进入Adapter的文件夹，运行
```shell
#激活在Maibot文件夹下的虚拟环境
..\Maibot\venv\Scripts\activate
python .\main.py
```
