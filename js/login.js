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

  if (users[username] && users[username] === password) {
    sessionStorage.setItem('user', username);
    localStorage.setItem('localLogin', username); // ✅ consistent
    window.location.href = 'chat.html';
  } else {
    alert('Invalid credentials.');
  }
}
