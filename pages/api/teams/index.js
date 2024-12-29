import { Pool } from 'pg';

// Initialize PostgreSQL connection pool using environment variables
const pool = new Pool({
  connectionString:'postgresql://postgres:JqhMCyobsOFiAiXg@db.hsnmfpkitybsxdizqoin.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Supabase with self-signed certificates
         // Enforces SSL connection to the database
  },
});

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method === 'GET') {
    try {
      // Query the database to fetch all teams
      const result = await pool.query('SELECT * FROM teams');

      // If no teams found, respond with 404
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No teams found' });
      }

      // Respond with teams data if found
      res.status(200).json(result.rows);
    } catch (err) {
      // Handle and log the error if the query fails
      console.error('Error fetching teams:', err);
      res.status(500).json({ error: 'Failed to fetch teams', message: err.message });
    }
  } else {
    // Respond with a 405 Method Not Allowed error if method is not GET
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
