# 用户指南

<style>
.doc-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.doc-card {
  background: linear-gradient(135deg, #ff6b35 0%, #3b82f6 100%);
  border-radius: 15px;
  padding: 15px;
  color: white !important;
  text-decoration: none !important;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.doc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.doc-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #ff6b35 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.doc-card:hover::before {
  opacity: 1;
}

.doc-card-content {
  position: relative;
  z-index: 2;
}

.doc-card a {
  text-decoration: none !important;
  color: inherit !important;
}

.doc-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.3em;
  font-weight: 600;
  color: white;
}

.doc-card p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
  color: white;
}



.section-title {
  font-size: 1.8em;
  margin: 40px 0 20px 0;
  color: #333;
  border-bottom: 3px solid #ff9a56;
  padding-bottom: 10px;
}



.avatar-section {
  text-align: center;
  margin: 40px 0;
}

.avatar-section img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.avatar-section img:hover {
  transform: scale(1.1);
}
</style>



<div class="doc-cards">
  <a href="/manual/deployment/" class="doc-card">
    <div class="doc-card-content">
      <h3>📦 如何安装麦麦</h3>
      <p>安装MaiBot的详细教程</p>
    </div>
  </a>
</div>



<div class="doc-cards">
  <a href="/manual/usage/" class="doc-card">
    <div class="doc-card-content">
      <h3>✨ 功能介绍</h3>
      <p>探索MaiBot的所有功能特性，聊天、表情、记忆、个性化......</p>
    </div>
  </a>
</div>

<div class="doc-cards">
  <a href="/manual/adapters/" class="doc-card">
    <div class="doc-card-content">
      <h3>🔗 适配器</h3>
      <p>让麦麦可以连接到QQ等平台</p>
    </div>
  </a>
</div>



<div class="doc-cards">
  <a href="/manual/plugins/" class="doc-card">
    <div class="doc-card-content">
      <h3>🔌 插件</h3>
      <p>获取插件，安装、配置和管理各种插件</p>
    </div>
  </a>
</div>



<div class="doc-cards">
  <a href="/manual/configuration/" class="doc-card">
    <div class="doc-card-content">
      <h3>⚙️ 设置详解</h3>
      <p>了解MaiBot的配置选项</p>
    </div>
  </a>
  
  <a href="/manual/usage/backup" class="doc-card">
    <div class="doc-card-content">
      <h3>💾 备份你的麦麦</h3>
      <p>安全地备份和恢复你的MaiBot数据</p>
    </div>
  </a>
</div>

<div class="doc-cards">
  <a href="/faq/" class="doc-card">
    <div class="doc-card-content">
      <h3>❓ 常见问题</h3>
      <p>API相关问题、部署故障排除、功能使用疑问等</p>
    </div>
  </a>
</div>

### 其他

[最终用户许可协议](/manual/other/EULA)

[提问的艺术(麦麦版本)](/manual/other/ask_art)

[如何避免提出0/1问题](/manual/other/questions-with-yes-or-no-answers)

::: details 旧版相关内容

- [Docker部署](/manual/deployment/old/docker_deploy)
- [Linux手动部署](/manual/deployment/old/manual_deploy_linux)
- [Windows手动部署](/manual/deployment/old/manual_deploy_windows)
- [群晖NAS部署](/manual/deployment/old/synology_deploy)
- [新手Linux服务器部署](/manual/deployment/old/linux_deploy_guide_for_beginners)
:::

![MaiBot](/avatars/MaiM.png)
