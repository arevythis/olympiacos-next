import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // To allow connections to Supabase's self-signed cert
          // Enforce SSL connection to the DB
  },
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    // Validate that the 'id' is provided and is a valid number
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid or missing match ID' });
    }

    try {
      // Perform the DELETE query to remove the match
      const result = await pool.query('DELETE FROM matches WHERE id = $1', [id]);

      // If no rows were affected, it means no match was found with the given ID
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }

      // Success response with a message confirming deletion
      res.status(200).json({ message: 'Match deleted successfully' });
    } catch (err) {
      // Log detailed error for internal server error debugging
      console.error('Error deleting match:', err);
      res.status(500).json({ error: 'Failed to delete match', message: err.message });
    }
  } else {
    // Respond with Method Not Allowed if the method is not DELETE
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
