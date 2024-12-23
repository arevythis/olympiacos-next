// pages/api/checkLogin.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = "Vf90g1Hhvft6nMJ08A9fdX3t27L99xqXp"; // Use environment variables in production

export default function handler(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    res.status(200).json({ loggedIn: true, username: user.username });
  });
}