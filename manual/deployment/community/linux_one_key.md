# MaiBot Linux 一键脚本部署

作者：Astriora



## 使用脚本部署 MaiBot

## 安装wget

::: code-group

```bash [apt]
sudo apt install wget
```

```bash [yum]
sudo yum install wget
```

```bash [dnf]
sudo dnf install wget
```

```bash [pacman]
sudo pacman -S wget
```

```bash [zypper]
sudo zypper install wget
```

:::

## 下载脚本 & 部署

```bash


wget -O maibot-install.sh https://raw.githubusercontent.com/Astriora/Antlia/refs/heads/main/Script/MaiBot/MaiBot-install.sh &&
bash maibot-install.sh


```


## 启动
```bash
source ~/.bashrc #第一次需要更新shell
```
```bash
maibot
```