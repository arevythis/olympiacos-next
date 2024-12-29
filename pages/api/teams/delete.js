import { Pool } from 'pg';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Required for connecting to Supabase with self-signed certificates
         // Enforces SSL connection to the database
  },
});

export default async function handler(req, res) {
  // Only handle DELETE method
  if (req.method === 'DELETE') {
    const { id } = req.body; // Get ID from the request body

    // Validate ID - ensure it's not empty and is a valid number or string
    if (!id) {
      return res.status(400).json({ error: 'Team ID is required' });
    }

    try {
      // Execute DELETE query to remove the team from the database
      const result = await pool.query('DELETE FROM teams WHERE team_id = $1', [id]);

      // If no rows are affected, it means the team was not found
      if (result.rowCount === 0) {
        console.log(`Team with ID ${id} not found.`);
        return res.status(404).json({ error: `Team with ID ${id} not found` });
      }

      // Successful deletion
      res.status(200).json({ message: 'Team deleted successfully' });

    } catch (err) {
      // Handle database or query errors
      console.error('Error deleting team:', err);
      res.status(500).json({ error: 'Failed to delete team', message: err.message });
    }
  } else {
    // If the method is not DELETE, respond with Method Not Allowed
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
