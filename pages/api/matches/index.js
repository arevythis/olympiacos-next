import { Pool } from 'pg';

const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Disable SSL certificate validation for local dev
            // Ensure SSL mode is required for secure connection
  },
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Making the DB query to fetch matches
      const result = await pool.query(`
        SELECT * FROM matches;
      `);

      // If no matches are found, return 404
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No matches found' });
      }

      // Return matches in response
      return res.status(200).json(result.rows);
    } catch (err) {
      // Capture error details for debugging
      console.error('Error fetching matches:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
