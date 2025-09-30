# ☸ Kubernetes 部署

我们开发了麦麦的 Helm Chart，来帮助你将麦麦优雅地部署到 Kubernetes 中。

本文档默认你熟悉 Kubernetes 和 Helm，因此不会详细说明每一部分的作用。

## 📋 环境要求

- ✅ 已部署 Kubernetes（可以是单节点集群）
- ⚙️ 已安装 Helm v3.8.0 及以上版本
- 💾 Kubernetes 集群中部署有可用的 Storage Class
- 🌎 （非必须）有一个解析到集群入口的域名，且集群中部署有可用的 Ingress Class

## 🛠️ 部署步骤

### 🔍 一、查看 Helm Chart 信息

麦麦的 Helm Chart 发布在`oci://reg.mikumikumi.xyz/maibot/maibot`。

部署麦麦之前请先确认你要部署的版本。

你可以在 MaiBot 代码仓库的 [helm-chart-release 分支](https://github.com/MaiM-with-u/MaiBot/tree/helm-chart-release/helm-chart) 中查看所有可用的 Helm Chart 版本以及对应的麦麦版本。

本文档后续以`<MAIBOT_VERSION>`等字样作为 Helm Chart 版本的占位符，请将其替换为你需要安装的实际版本。

如果你想查看 Chart 的信息：
```shell
helm show chart oci://reg.mikumikumi.xyz/maibot/maibot --version <MAIBOT_VERSION>
```

如果你想拉取完整的 Chart 到本地：
```shell
helm pull oci://reg.mikumikumi.xyz/maibot/maibot --version <MAIBOT_VERSION>
```

### 📝 二、获取并修改 Chart 的 values 文件

将 Chart 的 values 文件输出到 `maibot.yaml` 中：
```shell
helm show values oci://reg.mikumikumi.xyz/maibot/maibot --version <MAIBOT_VERSION> > maibot.yaml
```

编辑 `maibot.yaml` 文件，按需配置选项。

#### Values项说明

`values.yaml`分为几个大部分。

1. `EULA` & `PRIVACY`: 用户必须同意这里的协议才能成功部署麦麦。

2. `adapter`: 麦麦的Adapter的部署配置。

3. `core`: 麦麦本体的部署配置。

4. `statistics_dashboard`: 麦麦的运行统计看板部署配置。

   麦麦每隔一段时间会自动输出html格式的运行统计报告，此统计报告可以部署为看板。

   出于隐私考虑，默认禁用。

5. `napcat`: Napcat的部署配置。

   考虑到复用外部Napcat实例的情况，Napcat部署已被解耦。用户可选是否要部署Napcat。

   默认会捆绑部署Napcat。

6. `sqlite_web`: sqlite-web的部署配置。

   通过sqlite-web可以在网页上操作麦麦的数据库，方便调试。不部署对麦麦的运行无影响。

   此服务如果暴露在公网会十分危险，默认不会部署。

7. `config`: 这里填写麦麦各部分组件的运行配置文件。

   这里填写的配置文件需要严格遵守yaml文件的缩进格式。

   - `adapter_config`: 对应adapter的`config.toml`。详见 [Adapter 文档](https://docs.mai-mai.org/manual/adapters/napcat.html)。

     此配置文件中对于`host`和`port`的配置会被上面`adapter.service`中的配置覆盖，因此不需要改动。

   - `core_model_config`: 对应core的`model_config.toml`。详见[模型配置指南](https://docs.mai-mai.org/manual/configuration/configuration_model_standard)。

   - `core_bot_config`: 对应core的`bot_config.toml`。详见[配置指南](https://docs.mai-mai.org/manual/configuration/configuration_standard)。

::: tip
编辑完毕后，请妥善保存此 values 文件。
:::

### 🏠️ 三、创建 Kubernetes 命名空间

在 Kubernetes 中为麦麦创建一个命名空间，例如 `bot`：
```shell
kubectl create ns bot
```

### 📥 四、部署麦麦实例

根据刚才编辑好的 `maibot.yaml`，将麦麦部署到 `bot` 命名空间中。为此安装实例取一个名字，例如 `maimai`。

```shell
helm install maimai oci://reg.mikumikumi.xyz/maibot/maibot --namespace bot --version <MAIBOT_VERSION> --values maibot.yaml
```

adapter 的配置文件会通过 job 在部署时动态生成，因此部署会花费一分钟左右，耐心等待即可。

如果是首次部署，在 adapter 的配置文件生成完毕之前，adapter Pod 可能会启动失败。这是正常现象，等待一分钟左右即可自行启动。

::: tip
adapter 的配置文件生成任务是通过 Helm Chart 的 post-install hook 实现的，仅会在每次 helm install/upgrade/rollback 时触发。
:::

::: tip
你可以在集群内部署多个麦麦的安装实例，只要这些实例的名字不同即可。
:::

### ⚡ 五、配置 napcat 连接麦麦

打开 napcat 的控制台。

- 如果捆绑部署了 napcat，且配置了 Ingress，那么可以在浏览器中打开类似 `https://napcat.example.com/` 的网址（values 中配置的域名），抵达控制台。

- 如果捆绑部署了 napcat，但未配置 Ingress，那么需要查看 napcat 的 Service，通过端口转发（默认为6099）或 NodePort 访问控制台的端口。

- 如果未捆绑部署，决定使用外部 napcat 实例，请打开外部 napcat 的控制台。

进入控制台后，登录麦麦使用的 QQ，随后立即修改控制台密码。

连接麦麦的步骤：

1. 进入`网络配置`，新建`Websocket客户端`。

2. 启用配置，为此连接起一个名字，例如`MaiMai`。

3. 填写麦麦的 adapter 的 Websocket 地址。

   - 如果捆绑部署了 napcat，此处应当填写的 URL 为：
     ```text
     ws://<RELEASE_NAME>-maibot-adapter:<ADAPTER_SVC_PORT>/
     
     # RELEASE_NAME 为麦麦的安装实例名，如 maimai
     # ADAPTER_SVC_PORT 为 adapter 的服务端口，默认为8095
     
     # 一个示例：
     ws://maimai-maibot-adapter:8095/
     ```

     ::: tip
     k8s 的集群内 DNS 名称规则：[Service 与 Pod 的 DNS](https://kubernetes.io/zh-cn/docs/concepts/services-networking/dns-pod-service/)。
     :::
     
   - 如果未捆绑部署 napcat，决定使用外部 napcat 实例，此处应当填写 adapter 的 Websocket 服务的 URL。

     你可以根据 adapter 的 Service 的 ClusterIP + Port 来填写，也可以根据节点的 IP + NodePort 来填写，也可以自行实现端口穿透来填写。

4. 心跳间隔与 values 中的 `config.adapter_config.napcat_server.heartbeat_interval`保持一致（默认一致，不需要修改）。

5. 为了提升安全性，可以为 adapter 与 Napcat 之间的连接设置 Token。Token 需要与 values 中的 `config.adapter_config.napcat_server.token`保持一致。默认不启用 Token。

6. 点击保存，观察 adapter 和 core 的日志，查看是否成功连接。

### 🎉 六、测试麦麦

现在可以发消息给麦麦，测试是否可用。

## ⏫ 升级麦麦

Helm Chart 的开发通常会滞后主版本一段时间。当麦麦有了新的 Release，对应的 Helm Chart 可能晚几天才会发布，在这期间请耐心等待。

当新版本的 Helm Chart 可用后，请按此步骤更新麦麦的安装实例：

1. 重命名旧版的 values 文件：
   ```shell
   mv maibot.yaml maibot-old.yaml
   ```

2. 获取新版的 values 文件：
   ```shell
   helm show values oci://reg.mikumikumi.xyz/maibot/maibot --version <NEW_VERSION> > maibot.yaml
   ```

3. 参照旧版本的 values 文件，按需填写新版本的 values 文件。

   通常 values 文件主体不会有大变动，而 config 部分会有较多变动，需要特别关注。

4. 备份麦麦的各个组件的存储卷。这不是必须的，但是是推荐做法，用于在升级出现问题时回滚。

5. 升级麦麦实例：
   ```shell
   helm upgrade maimai oci://reg.mikumikumi.xyz/maibot/maibot --namespace bot --version <NEW_VERSION> --values maibot.yaml
   ```

## ✏️ 修改麦麦配置

麦麦的配置文件会通过 ConfigMap 资源注入各个组件内。

对于通过 Helm Chart 部署的麦麦，如果需要修改配置，不应该直接修改这些 ConfigMap，否则下次 Helm 更新可能会覆盖掉所有配置。

最佳实践是重新配置 Helm Chart 的 values，然后通过`helm upgrade`更新麦麦的实例。

```shell
helm upgrade maimai oci://reg.mikumikumi.xyz/maibot/maibot --namespace bot --version <CURRENT_VERSION> --values maibot.yaml
```

## ↩ 回滚麦麦

如果不慎改错了配置，可以使用`helm rollback`命令回滚部署配置：
```shell
helm history maimai --namespace bot  # 查看麦麦的所有部署版本历史
helm rollback maimai --namespace bot  # 回到麦麦的上一个版本
helm rollback maimai <HISTORY_INDEX> --namespace bot  # 回到麦麦的指定版本
```

注意，这种方法回滚的只是麦麦的部署配置（如镜像版本）和各个组件的配置文件，麦麦保存的实际数据无法直接回滚，请谨慎操作。

此方法也支持跨版本回滚，但存在风险。如果将麦麦由新版本回滚到旧版本，发现麦麦长时间无法启动，这可能是由于麦麦的新版数据无法被旧版本识别。这个时候需要将之前备份的旧版本的存储卷数据还原回去，才有可能恢复。

## 🗑 卸载麦麦

使用以下命令可以移除麦麦的安装实例：
```shell
helm uninstall maimai -n bot
```

卸载后，部署麦麦所需的 values 将无法找回，建议保存好 values 文件。

卸载后，麦麦的存储卷数据是否会被删除取决于存储类配置，可能需要集群管理员手动处理。

## ❓ 其他注意事项

### 📥 操作前备份麦麦数据

不同版本的麦麦进行升级/降级操作，可能会导致麦麦的数据发生异常。

回滚麦麦的部署配置，也可能导致麦麦的数据异常。

在进行这些操作之前，推荐提前备份麦麦的存储卷数据。

### 🔄 动态生成的 ConfigMap

adapter 的 ConfigMap 是每次部署/更新麦麦的安装实例时动态生成的。

动态生成的原因：

- core 服务的 DNS 名称是动态的，无法在 adapter 服务的配置文件中提前确定。
- 一些与 k8s 现有资源冲突的配置需要被重置。

因此，首次部署时，ConfigMap 的生成会需要一些时间，adapter Pod会无法启动，等待一分钟左右即可。

### 🗙 挂载冲突

如果启用了运行统计看板，那么 statistics_dashboard 会与 core 共同挂载 statistics_dashboard 存储卷，用于同步 html 文件。

如果 k8s 集群有多个节点，且 statistics_dashboard 与 core 未调度到同一节点，那么就需要 statistics_dashboard 的 PVC 具备`ReadWriteMany`访问模式。

不是所有存储卷的底层存储都支持`ReadWriteMany`访问模式。

如果你的存储底层无法支持`ReadWriteMany`访问模式，你可以通过`nodeSelector`配置将 statistics_dashboard 与 core 调度到同一节点来避免问题。

*如果启用了 sqlite-web ，那么上述问题也同样适用于 sqlite-web 与 core，需要注意。*
