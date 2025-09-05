export async function login(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch("/api/getHistory");
  return res.json();
}

export async function sendMessage(sender, receiver, message) {
  const res = await fetch("/api/sendMessage", {
    method: "POST",
    body: JSON.stringify({ sender, receiver, message })
  });
  return res.json();
}
