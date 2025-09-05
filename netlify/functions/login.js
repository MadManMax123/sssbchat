const jwt = require("jsonwebtoken");
const config = require("../../config.json");

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body || "{}");

  const user = config.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };
  }

  const token = jwt.sign({ username }, config.server.jwt_secret, { expiresIn: "1h" });
  return { statusCode: 200, body: JSON.stringify({ token }) };
};
