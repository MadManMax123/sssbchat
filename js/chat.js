// Ensure user is logged in and set user name
let user = null;
if (window.location.pathname.includes('chat.html')) {
  user = sessionStorage.getItem('user');
  if (!user) {
    window.location.href = 'index.html';
  } else {
    const userNameEl = document.getElementById('user-name');
    if userNameEl) userNameEl.textContent = user;
    loadMessages();
    setInterval(loadMessages, 5000);
  }
} else {
  user = sessionStorage.getItem('user');
}

// Logout
function logout() {
  sessionStorage.clear();
}

// CONFIG — replace with your URLs
const webhookURL = "https://hook.us1.make.com/zlo4cpb5i98dr4gpict4c2bp2w0ah01y";   // Make.com webhook
const sheetURL = "https://script.google.com/macros/s/AKfycbwNG3HF3KncJjbXO95nqm-sEXA1w7aMjFBrIbnK6bJQiXPI-YLrWQ9BrReVSDk02Fdn/exec";      // Apps Script Web App URL (doGet)

// Send a message
async function sendMessage() {
  const message = document.getElementById('message').value;
  if (!message) return;

  const payload = {
    id: crypto.randomUUID(),  // generate unique ID client-side
    user: user,
    message: message
  };

  // Send to Make.com webhook (which writes to Google Sheets)
  try {
    await fetch(webhookURL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error("Webhook error:", err);
  }

  // Clear input
  document.getElementById('message').value = '';

  // Refresh chat after sending
  loadMessages();
}

// Load messages from Google Sheets JSON, with cache preload
async function loadMessages() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  // 1. Preload from cache (localStorage)
  const cached = localStorage.getItem('chatCache');
  if (cached) {
    try {
      const cachedData = JSON.parse(cached);
      renderMessages(cachedData, chatBox);
    } catch {}
  }

  // 2. Fetch latest from server
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();

    // Save to cache (keep only last 30 messages for speed)
    localStorage.setItem('chatCache', JSON.stringify(data.slice(-30)));

    renderMessages(data, chatBox);
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

// Helper to render messages
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

// Apply chat bubble customisation from localStorage
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
