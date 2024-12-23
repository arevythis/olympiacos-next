import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'football',
  password: '1891999vv',
  port: 5432,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { team_name, logo_url } = req.body;  

    try {
      const result = await pool.query(
        'INSERT INTO teams (team_name, logo_url) VALUES ($1, $2) RETURNING team_id',
        [team_name, logo_url]
      );

      res.status(201).json({ message: 'Team added successfully', team: result.rows[0] });
    } catch (err) {
      console.error('Error adding team:', err);
      res.status(500).json({ error: 'Failed to add team' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}