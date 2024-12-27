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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM matches');
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No matches found' });
      }
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching matches:', err);
      res.status(500).json({ error: 'Failed to fetch matches' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
