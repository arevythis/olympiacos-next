import 'dotenv/config';
dotenv.config();

import { Pool } from 'pg';

// Use environment variables for the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Supabase
  },
});

const JWT_SECRET = "Vf90g1Hhvft6nMJ08A9fdX3t27L99xqXp";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email } });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An error occurred during login.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
