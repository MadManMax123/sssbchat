// Ensure user is logged in
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

// Load messages from Google Sheets JSON
async function loadMessages() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    console.log("Fetched data:", data);

    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    chatBox.innerHTML = '';
    data.forEach(item => {
      const msgClass = item.user === user ? "my-message" : "other-message";
      chatBox.innerHTML += `
        <div class="chat-msg ${msgClass}">
          <small>[${item.timestamp}]</small><br>
          <strong>${item.user}:</strong> ${item.message}
        </div>
      `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

// Auto-refresh chat every 5s
if (window.location.pathname.includes('chat.html')) {
  loadMessages();
  setInterval(loadMessages, 5000);
}
