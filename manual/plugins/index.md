# 麦麦插件广场

## 插件广场

<div class="plugin-website-card">
  <div class="card-header">
    <h3>🌐 插件展示网站</h3>
  </div>
  <div class="card-content">
    <p>我们现有的插件列表已经可以在插件展示网站上查看。</p>
    <div class="website-links">
      <a href="https://plugins.maibot.chat" class="backup-link" target="_blank">
        <span class="link-text">plugins.maibot.chat</span>
      </a>
    </div>
  </div>
</div>

<style>
.plugin-website-card {
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header h3 {
  margin: 0 0 15px 0;
  color: #24292e;
  font-size: 18px;
}

.card-content p {
  margin: 0 0 15px 0;
  color: #586069;
  line-height: 1.5;
}

.website-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.primary-link, .backup-link {
  padding: 12px 16px;
  background: white;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.primary-link:hover, .backup-link:hover {
  border-color: #0366d6;
  box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
}

.link-text {
  color: #24292e;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  text-decoration: none;
}

.primary-link .link-text {
  color: #0366d6;
}

.backup-link .link-text {
  color: #586069;
}
</style>

## 插件使用
对于下载的插件，你只需要把下载放在根目录下面的`plugins`目录下即可。

随后，请根据插件作者的说明，自行配置里面的配置文件以使用插件！

## 插件开发
请参考[插件开发指南](/develop/plugin_develop/)。

## 贡献插件
如果你想让你的插件能够出现在上面说的展示网站上，那么你可以去[插件仓库](https://github.com/Maim-with-u/plugin-repo)提交一个PR，根据里面的[CONTRIBUTING.md](https://github.com/MaiM-with-u/plugin-repo/blob/main/CONTRIBUTING.md)来提交你的插件信息。

待审核通过合并后，你的插件就会出现在展示网站上。
