const users = {
  "Sneha Sarkar": "rai",
  "Satyaki Bandopadhyay": "bittu"
};

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }
  // Store user in sessionStorage and localStorage
  sessionStorage.setItem('user', username);
  localStorage.setItem('user', username);
  // Redirect to chat page
  window.location.href = 'chat.html';
}
