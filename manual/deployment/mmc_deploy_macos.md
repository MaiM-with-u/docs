# macOS 部署

本教程测试环境：macOS 26.0.1 (Tahoe)

::: warning
本教程为部署到QQ平台的教程，不代表其他平台的部署方式相同
:::

::: tip
知识库使用说明在[这里](/manual/usage/features/lpmm)
:::

::: info
本教程推荐使用 [uv](https://docs.astral.sh/uv/) 作为 Python 包管理器，它提供了更快的包安装速度和更好的依赖管理体验。当然，传统的 pip 和 conda 方式依然可用。
:::

## 系统要求

- Python >= 3.10
- macOS 10.15 (Catalina) 或更高版本
- Git
- Xcode Command Line Tools 或 Homebrew
- uv >= 0.1.0 (推荐使用最新版本)

## 部署步骤

### 一、获取必要的文件

1. 创建 `MaiM-with-u` 文件夹并进入
2. 通过 git clone 将 [麦麦 repo](https://github.com/MaiM-with-u/MaiBot) clone 到本地
3. 通过 git clone 将 [MaiBot-Napcat-Adapter](https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter) clone 到本地

```bash
mkdir MaiM-with-u
cd MaiM-with-u
git clone https://github.com/MaiM-with-u/MaiBot.git
git clone https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter.git
```

### 二、环境配置

#### 确认 Python 版本

macOS 自带的 Python 版本可能较低，需确保 Python 版本为 3.10 及以上：

```bash
python3 --version
```

如果版本低于 3.10，可以通过 Homebrew 安装更高版本：

```bash
# 安装 Homebrew (如果尚未安装)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Python 3.11
brew install python@3.11
```

#### 安装 uv (推荐)

首先安装 uv 包管理器，可以通过以下命令快速安装：

```bash
# 使用 curl 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 或使用 pip 安装
pip3 install uv
```

安装完成后，确保 uv 在 PATH 中：

```bash
# 添加到 shell 配置文件 (zsh)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 或 bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 验证安装
uv --version
```

::: tip
使用 uv 时需要先运行 `uv venv` 创建虚拟环境，然后使用 `uv pip install` 安装依赖，或者直接使用 `uv run` 命令来自动管理虚拟环境。
:::

#### Conda 版 (传统方式)

如果你习惯使用 conda，可以通过 Miniconda 或 Anaconda 管理环境：

```bash
# 下载并安装 Miniconda (适用于 Apple Silicon)
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
bash Miniconda3-latest-MacOSX-arm64.sh

# 或适用于 Intel Mac
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
bash Miniconda3-latest-MacOSX-x86_64.sh

# 创建虚拟环境
conda create -n MaiBotEnv python=3.11
conda activate MaiBotEnv
```

#### 虚拟环境版 (传统方式)

在 `MaiM-with-u` 目录下创建 Python 虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
```

::: tip
激活虚拟环境后，命令行提示符前会显示 `(.venv)`，表示已进入虚拟环境。后续所有操作都应在虚拟环境中进行。
:::

### 三、手动编译 quick_algo

由于 `quick_algo` 包在 macOS 上通过 pip 直接安装可能会失败，需要手动编译。

#### 1. 克隆 MaiMBot-LPMM 仓库

```bash
git clone https://github.com/MaiM-with-u/MaiMBot-LPMM.git
cd MaiMBot-LPMM
```

#### 2. 安装编译工具

确保已安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

验证 Clang 编译器是否安装成功：

```bash
clang --version
```

#### 3. 安装 LPMM 依赖

```bash
pip install -r requirements.txt
```

::: tip
如果你位于中国大陆，可以使用镜像源加速下载：
```bash
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple
```
:::

#### 4. 编译并安装 quick_algo

进入 `lib/quick_algo/` 目录，运行编译脚本：

```bash
cd lib/quick_algo
python build_lib.py --cleanup --cythonize --install
```

编译成功后，会显示类似以下的输出：

```
INFO - Cythonize completed successfully.
INFO - Installing package...
INFO - Install package successfully.
Successfully installed quick-algo-0.1.3
```

### 四、依赖安装

#### 使用 uv 安装依赖 (推荐)

1. 进入 MaiBot 文件夹，创建虚拟环境并安装依赖

```bash
cd ../../../MaiBot
uv venv
uv pip install -r requirements.txt
```

::: tip
`uv venv` 创建虚拟环境，`uv pip install` 在该环境中安装依赖。由于已经手动编译并安装了 `quick_algo`，该包会被跳过。
:::

2. 回到上一级文件夹，进入 MaiBot-Napcat-Adapter 文件夹，安装依赖

```bash
cd ../MaiBot-Napcat-Adapter
uv venv
uv pip install -r requirements.txt
```

#### 使用 pip 安装依赖 (传统方式)

1. 返回到 `MaiBot` 目录并安装依赖：

```bash
cd ../../../MaiBot
pip install -r requirements.txt
```

::: tip
由于已经手动编译并安装了 `quick_algo`，pip 会跳过该包的安装。
:::

2. 安装 MaiBot-Napcat-Adapter 依赖

```bash
cd ../MaiBot-Napcat-Adapter
pip install -r requirements.txt
```

### 五、配置 MaiBot 和 Adapter

#### MaiBot 配置

1. 在 `MaiBot` 文件夹中创建 `config` 目录：

```bash
cd ../MaiBot
mkdir -p config
```

2. 复制模板配置文件：

```bash
cp template/bot_config_template.toml config/bot_config.toml
cp template/model_config_template.toml config/model_config.toml
cp template/template.env .env
```

3. 编辑 `.env` 文件，设置监听端口：

```bash
# 使用文本编辑器打开 .env 文件
nano .env
# 或使用 vim
vim .env
```

修改以下内容：

```ini
HOST=127.0.0.1
PORT=8000
```

4. 配置 AI 模型和其他设置，请参考[配置指南](/manual/configuration/index)

#### MaiBot Napcat Adapter 配置

1. 复制配置文件模板：

```bash
cd ../MaiBot-Napcat-Adapter
cp template/template_config.toml config.toml
```

2. 编辑 `config.toml`，配置以下关键字段：

```toml
[Napcat_Server]  # Napcat连接的ws服务设置
host = "localhost"  # Napcat设定的主机地址
port = 8095         # Napcat设定的端口
heartbeat = 30      # 与Napcat设置的心跳相同（按秒计）

[MaiBot_Server]  # 连接麦麦的ws服务设置
platform_name = "qq"  # 标识adapter的名称（必填）
host = "localhost"    # 麦麦在.env文件中设置的主机地址
port = 8000           # 麦麦在.env文件中设置的端口（需与MaiBot的.env中PORT一致）
```

::: tip
- `[Napcat_Server]` 的 `port` 应该与 Napcat 设置的反向代理 URL 端口相同
- `[MaiBot_Server]` 的 `port` 应该与麦麦本体 `.env` 中的 `PORT` 相同
- 更多配置说明请参考 [Napcat Adapter 配置指南](/manual/adapters/napcat)
:::

### 六、部署 Napcat

请参考 NapCatQQ 官方文档进行部署：
- [Shell 版](https://www.napcat.wiki/guide/boot/Shell)
- [Framework 版](https://www.napcat.wiki/guide/boot/Framework)

任选一种即可。

### 七、运行

#### 启动顺序

1. 首先启动 Napcat
2. 启动麦麦本体
3. 启动 Adapter

#### 使用 uv 运行 (推荐)

**启动麦麦：**

```bash
cd /path/to/MaiM-with-u/MaiBot
uv run python bot.py
```

**启动 Adapter：**

打开新的终端窗口：

```bash
cd /path/to/MaiM-with-u/MaiBot-Napcat-Adapter
uv run python main.py
```

::: tip
`uv run` 会自动激活项目的虚拟环境并运行命令，无需手动激活虚拟环境。
:::

#### 使用传统方式运行

**启动麦麦：**

打开终端，进入 MaiBot 目录并激活虚拟环境：

```bash
cd /path/to/MaiM-with-u/MaiBot
source ../.venv/bin/activate
python bot.py
```

**启动 Adapter：**

打开新的终端窗口，进入 Adapter 目录并激活虚拟环境：

```bash
cd /path/to/MaiM-with-u/MaiBot-Napcat-Adapter
source ../.venv/bin/activate
python main.py
```

::: tip
可以使用 `tmux` 或 `screen` 等工具在后台运行程序：

```bash
# 使用 tmux
brew install tmux
tmux new -s maibot
# 在 tmux 会话中运行程序
# 按 Ctrl+B 然后按 D 可以分离会话
# 使用 tmux attach -t maibot 重新连接
```
:::

### 八、验证运行

成功启动后，你应该能看到：

1. MaiBot 输出启动日志，显示 WebSocket 服务器已启动
2. Adapter 成功连接到 MaiBot 和 Napcat
3. Napcat 显示已连接到 QQ 服务器

可以在 QQ 中向机器人发送消息进行测试。

## 常见问题

### 1. quick_algo 编译失败

如果编译过程中出现错误，请检查：
- 是否已安装 Xcode Command Line Tools
- Python 版本是否 >= 3.10
- 是否在虚拟环境中操作

### 2. 权限问题

macOS 可能会提示安全警告，需要在"系统偏好设置" -> "安全性与隐私"中允许运行。

### 3. 端口占用

如果提示端口已被占用，可以：
- 修改 `.env` 文件中的 `PORT` 设置
- 或使用 `lsof -i :8000` 查看占用端口的进程并终止

### 4. 虚拟环境激活失败

确保使用正确的命令激活虚拟环境：

```bash
source .venv/bin/activate
```

而不是 Windows 的激活命令。

## 更新麦麦

要更新麦麦到最新版本：

```bash
cd /path/to/MaiM-with-u/MaiBot
git pull
source ../.venv/bin/activate
pip install -r requirements.txt --upgrade
```

同样的方式更新 Adapter：

```bash
cd /path/to/MaiM-with-u/MaiBot-Napcat-Adapter
git pull
source ../.venv/bin/activate
pip install -r requirements.txt --upgrade
```

## 卸载

要完全卸载麦麦：

```bash
# 停止所有运行的进程
# 删除整个目录
cd /path/to
rm -rf MaiM-with-u
```

## 参考链接

- [配置指南](/manual/configuration/index)
- [LPMM 知识库](/manual/usage/features/lpmm)
- [插件开发](/develop/plugin_develop/index)
- [常见问题](/faq/index)
