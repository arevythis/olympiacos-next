import dotenv from 'dotenv';
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
    const { id } = req.query;
    try {
      const result = await pool.query('SELECT * FROM teams WHERE team_id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching team by ID:', err);
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
