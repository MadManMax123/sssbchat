const API_URL = "https://script.google.com/macros/s/AKfycbyOn6uBx6r5YwNeRkcu_S_kHa7a0lFoLr-c1iEMr6kdmk2drnbXD0m9Jdo2LFFqH1B_/exec"; // replace with your deployed URL
const USERNAME = prompt("Enter your username (user1 or user2):");

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Fetch messages every 2 seconds
async function fetchMessages() {
  try {
    const res = await fetch(API_URL);
    const messages = await res.json();

    chatBox.innerHTML = "";
    messages.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("message", msg.sender);
      div.textContent = `${msg.sender}: ${msg.message}`;
      chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
}

// Send message
async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ sender: USERNAME, message: text }),
      headers: { "Content-Type": "application/json" }
    });
    messageInput.value = "";
    fetchMessages();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

setInterval(fetchMessages, 2000);
fetchMessages();
