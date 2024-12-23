// api/teams/delete.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'football',
  password: '1891999vv',
  port: 5432,
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body; // Ensure the id is coming from the request body
    try {
      const result = await pool.query('DELETE FROM teams WHERE team_id = $1', [id]);

      if (result.rowCount === 0) {
        console.log(`Team with ID ${id} not found.`);
        return res.status(404).json({ error: 'Team not found' });
      }

      res.status(200).json({ message: 'Team deleted successfully' });
    } catch (err) {
      console.error('Error deleting team:', err);
      res.status(500).json({ error: 'Failed to delete team', message: err.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}