import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString:'postgresql://postgres:JqhMCyobsOFiAiXg@db.hsnmfpkitybsxdizqoin.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false,  // Required for connecting to Supabase's self-signed certificate
            // Enforces SSL connection to the DB
  },
});

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method === 'POST') {
    // Destructure input data from the request body
    const { team_name, logo_url } = req.body;

    // Validate required fields
    if (!team_name || !logo_url) {
      return res.status(400).json({ error: 'Missing required fields: team_name or logo_url' });
    }

    try {
      // Check if the team already exists (optional feature for preventing duplicates)
      const duplicateCheck = await pool.query(
        'SELECT * FROM teams WHERE team_name = $1',
        [team_name]
      );

      if (duplicateCheck.rows.length > 0) {
        return res.status(409).json({ error: 'Team with this name already exists' });
      }

      // Insert the new team into the database
      const result = await pool.query(
        'INSERT INTO teams (team_name, logo_url) VALUES ($1, $2) RETURNING team_id',
        [team_name, logo_url]
      );

      // Return success response with the team data
      res.status(201).json({ message: 'Team added successfully', team: result.rows[0] });

    } catch (err) {
      // Log detailed error for debugging purposes
      console.error('Error adding team:', err);
      res.status(500).json({ error: 'Failed to add team', message: err.message });
    }
  } else {
    // If request method is not POST, respond with Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
