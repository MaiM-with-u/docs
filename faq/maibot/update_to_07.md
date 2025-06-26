# 从 0.7.x 升级到 0.8.x 的升级说明

从0.7.0升级到0.8.0非常简单。

只需要移动`data`文件夹到新的麦麦文件夹覆盖即可，同时你需要检查更新后的配置文件，修改变动项。

还有使用一键包4.0以上的用户，可以直接通过一键包快速更新麦麦版本。 

# 从0.6.x升级到0.7.x 的升级说明

如果你是从0.6.x版本升级到0.7.x版本，那么这个文档是为你准备的。

## 0.7.x版本的主要变化
1. 配置文件
2. 数据库
3. Napcat Adapter


**以及，我们很可惜的告诉你，现在PFC功能暂时失效了，所以如果你是PFC用户，那么请暂时不要升级到0.7.x版本。**

因此，我们逐一讲解一下升级的方法。

## 升级
### 配置文件升级
本版本同样保留了自动升级配置文件的功能，但是由于配置文件变化很大，因此需要你手动比对`config/old`下面按照时间给出的备份配置文件和你自动升级后的配置文件。

你可以参考[标准配置指南](/manual/configuration/configuration_standard)来研究每一个功能对应的作用，并手动完善你自己的配置文件。

### 数据库升级
在新版中，我们抛弃了原来的MongoDB数据库，改为使用SQLite数据库。

<del>解决不了MongoDB不稳定的问题就解决MongoDB.jpg</del>

因此，我们提供了一个脚本帮助你迁移原来的MongoDB数据到SQLite数据库。

这个脚本位于`scripts/mongodb_to_sqlite.py`
你可以通过根目录下面的`mongodb_to_sqlite.bat`脚本来运行它，或者直接在命令行中运行：

```bash
python scripts/mongodb_to_sqlite.py
```
运行脚本后，它会自动连接到你的MongoDB数据库，并将数据迁移到SQLite数据库中。

::: tip
如果你是喜欢追`dev`分支的用户，那么使用这个脚本之前，需要你先删除原来的`data/maibot.db`文件，否则脚本可能会报错。
:::

### Napcat Adapter升级
现在控制麦麦消息是否接收已经不再位于 MaiBot 本体了，而是位于 Adapter 的配置文件了，请参照 Napcat Adapter [配置文件指南](/manual/adapters/napcat)进行配置和更新