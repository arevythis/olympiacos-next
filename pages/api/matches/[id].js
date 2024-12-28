import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

// Use environment variables for the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Supabase
      sslmode: 'require'
  },
});
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
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

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching match:', err);
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM matches WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }

      res.status(200).json({ message: 'Match deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
