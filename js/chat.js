// =======================
// Auto-login handling
// =======================

// Restore login from localStorage if needed
if (!sessionStorage.getItem('user')) {
  const cached = localStorage.getItem('localLogin');
  if (cached) {
    sessionStorage.setItem('user', cached);
  } else {
    window.location.href = 'index.html';
  }
}

// Always update the username in the DOM
const user = sessionStorage.getItem('user');
const userNameEl = document.getElementById('user-name');
if (userNameEl && user) userNameEl.textContent = user;

if (window.location.pathname.includes('chat.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setInterval(loadMessages, 1000);
  });
}

// =======================
// Logout
// =======================
function logout() {
  sessionStorage.clear();
  window.location.href = 'index.html';
}

// =======================
// CONFIG
// =======================
const webhookURL = "https://hook.us1.make.com/zlo4cpb5i98dr4gpict4c2bp2w0ah01y";   // Make.com webhook
const sheetURL = "https://script.google.com/macros/s/AKfycbwNG3HF3KncJjbXO95nqm-sEXA1w7aMjFBrIbnK6bJQiXPI-YLrWQ9BrReVSDk02Fdn/exec"; // Apps Script Web App URL (doGet)

// =======================
// Send a message
// =======================
async function sendMessage() {
  const inputEl = document.getElementById('message');
  const message = inputEl.value.trim();
  if (!message) return;

  const payload = {
    id: crypto.randomUUID(),
    user: user,
    message: message
  };

  try {
    await fetch(webhookURL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Webhook error:", err);
  }

  inputEl.value = '';
  loadMessages();
}

// =======================
// Load messages
// =======================
async function loadMessages() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    renderMessages(data, chatBox);
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

// =======================
// Render messages
// =======================
function renderMessages(data, chatBox) {
  chatBox.innerHTML = '';
  data.forEach(item => {
    const isMe = item.user === user;
    const side = isMe ? "right" : "left";
    chatBox.innerHTML += `
      <div class="chat-message ${side}">
        <div class="chat-bubble">
          <span class="chat-user">${item.user}</span><br>
          ${item.message}
          <div class="chat-timestamp">${item.timestamp || ''}</div>
        </div>
      </div>
    `;
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// =======================
// Apply customisation (optional)
// =======================
(function() {
  const settings = JSON.parse(localStorage.getItem('chatCustomisation')) || {};
  if (settings.bubbleBgRight)
    document.documentElement.style.setProperty('--bubble-bg-right', settings.bubbleBgRight);
  if (settings.bubbleColorRight)
    document.documentElement.style.setProperty('--bubble-color-right', settings.bubbleColorRight);
  if (settings.bubbleBgLeft)
    document.documentElement.style.setProperty('--bubble-bg-left', settings.bubbleBgLeft);
  if (settings.bubbleColorLeft)
    document.documentElement.style.setProperty('--bubble-color-left', settings.bubbleColorLeft);
})();
