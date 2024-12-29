import { Pool } from 'pg';

// Use environment variables for database connection
const pool = new Pool({
  connectionString:'postgresql://postgres:JqhMCyobsOFiAiXg@db.hsnmfpkitybsxdizqoin.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false, // Bypass SSL certificate verification during local development
          // Ensure SSL is always used for the connection
  },
});

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Query to fetch match details and scorers
      const result = await pool.query(`
        SELECT 
          m.id,
          m.home_team,
          m.away_team,
          m.home_score,
          m.away_score,
          m.venue,
          m.match_date,
          m.home_team_logo,
          m.away_team_logo,
          m.possession_home,
          m.possession_away,
          m.passes_home,
          m.passes_away,
          m.fouls_home,
          m.fouls_away,
          json_agg(
            json_build_object(
              'player_name', s.player_name,
              'team', s.team,
              'goal_time', s.goal_time
            )
          ) AS scorers
        FROM 
          matches m
        LEFT JOIN 
          scorers s ON m.id = s.match_id
        WHERE 
          m.id = $1
        GROUP BY 
          m.id;
      `, [id]);

      // If no match is found
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }

      // Return the fetched match data
      res.status(200).json(result.rows[0]);
    } catch (err) {
      // Log and return error message
      console.error('Error fetching match:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete query for match removal
      const result = await pool.query('DELETE FROM matches WHERE id = $1', [id]);

      // If no rows were deleted, match wasn't found
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }

      // Return success message
      res.status(200).json({ message: 'Match deleted successfully' });
    } catch (err) {
      // Handle error while deleting
      console.error('Error deleting match:', err);
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  } else {
    // Method not allowed, return an appropriate response
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
