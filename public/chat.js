// Bulle del'agent IA
(() => {
  const history = [];

  const button = document.getElementById('ask-ai');

  const panel = document.createElement('section');
  panel.className = 'chat-panneau';
  panel.hidden = true;
  panel.innerHTML = `
    <header class="chat-entete">
      <img class="chat-avatar" src="robot.png" alt="">
      <div>
        <strong>シモンのAIアシスタント</strong>
        <span class="en">Simon's AI assistant</span>
      </div>
      <button type="button" class="chat-fermer" aria-label="閉じる / Close">×</button>
    </header>
    <div class="chat-messages" aria-live="polite"></div>
    <form class="chat-formulaire">
      <input type="text" maxlength="500" required
             placeholder="質問してください / Ask me anything about Simon">
      <button type="submit">送信<br><span>Send</span></button>
    </form>`;

  document.body.append(panel);

  const list = panel.querySelector('.chat-messages');
  const form = panel.querySelector('form');
  const input = form.querySelector('input');
  const send = form.querySelector('button');

  function addMessage(role, text) {
    const bubble = document.createElement('p');
    bubble.className = `chat-msg chat-${role}`;
    bubble.textContent = text;
    list.append(bubble);
    list.scrollTop = list.scrollHeight;
    return bubble;
  }

  addMessage('assistant',
    'こんにちは！シモンについて何でも聞いてください。勉強、経験、プロジェクトなど。\n' +
    "Hi! Ask me anything about Simon: his studies, experience or projects.");

  // Le bouton disparaît quand le chat est ouvert, et revient à la fermeture
  button.addEventListener('click', () => {
    panel.hidden = false;
    button.hidden = true;
    // Sur téléphone, pas de focus : le clavier ne s'ouvre que quand on touche le champ
    if (matchMedia('(pointer: fine)').matches) input.focus();
  });
  panel.querySelector('.chat-fermer').addEventListener('click', () => {
    panel.hidden = true;
    button.hidden = false;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage('user', text);
    history.push({ role: 'user', content: text });

    send.disabled = true;
    const waiting = addMessage('assistant', '…');
    waiting.classList.add('chat-attente');
    try {
      const res = await fetch('api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (res.status === 429) {
        waiting.textContent = '質問が多すぎます。少し時間をおいてください。\nToo many questions, please try again later.';
        history.pop();
      } else if (!res.ok || !data.reply) {
        throw new Error(data.error);
      } else {
        waiting.textContent = data.reply;
        history.push({ role: 'assistant', content: data.reply });
      }
    } catch {
      waiting.textContent = 'エラーが発生しました。もう一度お試しください。\nSomething went wrong, please try again.';
      history.pop();
    }
    waiting.classList.remove('chat-attente');
    send.disabled = false;
    input.focus();
  });
})();
