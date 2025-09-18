# 📄 MaiBot 使用指南

我将向你注意介绍麦麦的所有主要功能和次要功能，以及特性

<style>
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.feature-card {
  border-radius: 15px;
  padding: 25px;
  color: white !important;
  text-decoration: none !important;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
}

.feature-card-content {
  position: relative;
  z-index: 2;
}

.feature-card h3 {
  margin: 0 0 15px 0;
  font-size: 1.4em;
  font-weight: 600;
  color: white;
}

.feature-card p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
  color: white;
}

.feature-card a {
  text-decoration: none !important;
  color: inherit !important;
}

/* 不同功能的颜色 */
.chat-card {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.personality-card {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.expression-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.memory-card {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.lpmm-card {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.emoji-card {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}
</style>

<div class="feature-cards">
  <a href="/manual/usage/features/chat" class="feature-card chat-card">
    <div class="feature-card-content">
      <h3>💬 聊天系统</h3>
      <p>聊天系统是麦麦的核心，这个系统能够在群聊中把握合适的发言时机，模仿人类的发言规律。由于不同群聊环境不同，你可能需要针对自己的需要，进行自己的配置。</p>
    </div>
  </a>
</div>

<div class="feature-cards">
  <a href="/manual/usage/features/personality" class="feature-card personality-card">
    <div class="feature-card-content">
      <h3>🎭 个性</h3>
      <p>麦麦提供了多个配置项来为每个你自己的麦麦定义不同的人格，性格，身份和说话风格。这些配置会在不同的地方发挥作用，不过我们不推荐太长的个性设置。</p>
    </div>
  </a>
</div>

<div class="feature-cards">
  <a href="/manual/usage/features/expression" class="feature-card expression-card">
    <div class="feature-card-content">
      <h3>🗣️ 表达方式</h3>
      <p>表达方式是麦麦特有的拟人功能，可以让麦麦学习特定群的说话风格，学习群聊中的言语方式和流行的梗。如果你想要配置在哪些群可以学习或使用，可以参见详细说明。</p>
    </div>
  </a>
</div>

<div class="feature-cards">
  <a href="/manual/usage/features/lpmm" class="feature-card lpmm-card">
    <div class="feature-card-content">
      <h3>📚 LPMM知识库</h3>
      <p>麦麦使用了LPMM作为知识库系统，可以进行知识的学习，并在合适的场景下调用并理解。LPMM性能卓越，但是知识的学习需要花费一些API额度。</p>
    </div>
  </a>
</div>

<div class="feature-cards">
  <a href="/manual/usage/features/emoji" class="feature-card emoji-card">
    <div class="feature-card-content">
      <h3>😄 表情包系统</h3>
      <p>麦麦可以在QQ群聊中自由的偷取和使用表情包，对表情包进行理解。如果你想要配置表情包偷取频率，或者想要手动修改表情包，请阅读详细说明。</p>
    </div>
  </a>
</div>

## 常见问题解答

有关常见问题的详细解答，请参考[常见问题](/faq/)页面，其中包含：

- API 相关问题
- 部署故障排除
- 功能使用疑问

