// Define valid users
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

  // Validate username + password
  if (users[username] && users[username] === password) {
    sessionStorage.setItem('user', username);       // session login
    localStorage.setItem('localLogin', username);   // persistent login
    window.location.href = 'chat.html';
  } else {
    alert('Invalid credentials.');
  }
}
