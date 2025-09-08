// Redirect if not logged in
const user = sessionStorage.getItem('user');
if (!user && window.location.pathname.includes('chat.html')) {
  window.location.href = 'index.html';
} else {
  const userNameEl = document.getElementById('user-name');
  if (userNameEl) userNameEl.textContent = user;
}

// Logout
function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

// Config
const webhookURL = "https://hook.us1.make.com/v4ygdpfk284q8c3dp3itkpjipb1qwtub"; // Replace with your Make.com webhook
const sheetURL   = "https://script.google.com/macros/s/AKfycbxlKaKV930SHWMd46-uUWrRe5tEyJs1-irUnzzF9jfLrkqWxZQ_OeZuOfw5zIsNOkzR/exec"; // Replace with published Google Sheet JSON

// Send message
async function sendMessage() {
  const messageEl = document.getElementById('message');
  const message = messageEl.value.trim();
  if (!message) return;

  const id = Date.now().toString();
  const timestamp = new Date().toISOString();

  try {
    await fetch(webhookURL, {
      method: 'POST',
      body: JSON.stringify({ id, timestamp, user, message }),
      headers: { 'Content-Type': 'application/json' }
    });

    messageEl.value = '';
    loadMessages();
  } catch (err) {
    console.error("Send failed:", err);
  }
}

// Custom bubble colors
function getBubbleStyles(userName) {
  const settings = JSON.parse(localStorage.getItem('chatCustomisation')) || {};
  if (userName === user) {
    // Current user (right)
    return `--bubble-bg-right: ${settings.bubbleBgRight || '#1abc9c'}; --bubble-color-right: ${settings.bubbleColorRight || '#fff'};`;
  } else {
    // Other user (left)
    return `--bubble-bg-left: ${settings.bubbleBgLeft || '#f1f8fb'}; --bubble-color-left: ${settings.bubbleColorLeft || '#232526'};`;
  }
}

// Load messages
async function loadMessages() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    chatBox.innerHTML = '';

    data.forEach(item => {
      let timeStr = '';
      if (item.timestamp) {
        const date = new Date(item.timestamp);
        timeStr = date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
      }

      const side = item.user === user ? 'right' : 'left';
      const bubbleStyles = getBubbleStyles(item.user);

      chatBox.innerHTML += `
        <div class="chat-message ${side}">
          <div class="chat-user">${item.user}</div>
          <div class="chat-bubble" style="${bubbleStyles}">
            ${item.message}
            ${item.user === user ? `<button class="delete-btn" onclick="deleteMessage('${item.id}')">🗑</button>` : ""}
          </div>
          <span class="chat-timestamp">${timeStr}</span>
        </div>
      `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Load failed:", err);
  }
}

// Delete message
async function deleteMessage(id) {
  try {
    await fetch(sheetURL, {
      method: "POST",
      body: JSON.stringify({ action: "delete", id }),
      headers: { "Content-Type": "application/json" }
    });
    loadMessages();
  } catch (err) {
    console.error("Delete failed:", err);
  }
}

// Auto-refresh
if (window.location.pathname.includes('chat.html')) {
  loadMessages();
  setInterval(loadMessages, 5000);
}
