import 'dotenv/config';
dotenv.config();

import { Pool } from 'pg';

// Use environment variables for the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Supabase
  },
});
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      home_team, away_team, match_date, home_score, away_score, venue,
      home_team_logo, away_team_logo, possession_home, possession_away,
      passes_home, passes_away, fouls_home, fouls_away, scorers
    } = req.body;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert match data
      const result = await client.query(
        'INSERT INTO matches (home_team, away_team, match_date, home_score, away_score, venue, home_team_logo, away_team_logo, possession_home, possession_away, passes_home, passes_away, fouls_home, fouls_away) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id',
        [home_team, away_team, match_date, home_score, away_score, venue, home_team_logo, away_team_logo, possession_home, possession_away, passes_home, passes_away, fouls_home, fouls_away]
      );

      const matchId = result.rows[0].id;

      const scorersArray = Array.isArray(scorers) ? scorers : [];

      for (let scorer of scorersArray) {
        await client.query(
          'INSERT INTO scorers (match_id, player_name, team, goal_time) VALUES ($1, $2, $3, $4)',
          [matchId, scorer.player_name, scorer.team, scorer.goal_time]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ message: 'Match added successfully' });

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error adding match:', err);
      res.status(500).json({ error: 'Failed to add match' });
    } finally {
      client.release();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
