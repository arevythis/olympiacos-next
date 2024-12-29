import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for connecting to Supabase's self-signed certificate
           // Enforces SSL connection to the DB
  },
});

export default async function handler(req, res) {
  // Ensure the correct HTTP method (GET) is being used
  if (req.method === 'GET') {
    const { id } = req.query;

    // Validate the 'id' is provided and is a valid number
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing team ID' });
    }

    try {
      // Query to fetch team details from the database
      const result = await pool.query('SELECT * FROM teams WHERE team_id = $1', [id]);

      // If no rows were returned, the team with the specified id was not found
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Return the team data in the response
      res.status(200).json(result.rows[0]);
    } catch (err) {
      // Log detailed error for debugging purposes
      console.error('Error fetching team by ID:', err);
      res.status(500).json({ error: 'Failed to fetch team', message: err.message });
    }
  } else {
    // If the request method is not GET, return Method Not Allowed status
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
