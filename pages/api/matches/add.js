import { Pool } from 'pg';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Avoid self-signed certificate errors during dev
          // Enforce SSL connections (ensure security)
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Destructuring input from the request body
    const {
      home_team, away_team, match_date, home_score, away_score, venue,
      home_team_logo, away_team_logo, possession_home, possession_away,
      passes_home, passes_away, fouls_home, fouls_away, scorers
    } = req.body;

    // Basic validation for required fields
    if (
      !home_team || !away_team || !match_date || home_score === undefined ||
      away_score === undefined || !venue || !home_team_logo || !away_team_logo ||
      !possession_home || !possession_away || !passes_home || !passes_away ||
      !fouls_home || !fouls_away
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const client = await pool.connect();

    try {
      // Start a database transaction to handle multi-table insertions
      await client.query('BEGIN');

      // Insert the match into the "matches" table
      const result = await client.query(
        `
          INSERT INTO matches 
            (home_team, away_team, match_date, home_score, away_score, venue, 
            home_team_logo, away_team_logo, possession_home, possession_away, 
            passes_home, passes_away, fouls_home, fouls_away)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
          RETURNING id
        `,
        [
          home_team, away_team, match_date, home_score, away_score, venue,
          home_team_logo, away_team_logo, possession_home, possession_away,
          passes_home, passes_away, fouls_home, fouls_away
        ]
      );

      const matchId = result.rows[0].id;

      // Insert scorers if they exist
      if (Array.isArray(scorers)) {
        for (let scorer of scorers) {
          await client.query(
            `
              INSERT INTO scorers 
                (match_id, player_name, team, goal_time)
              VALUES
                ($1, $2, $3, $4)
            `,
            [matchId, scorer.player_name, scorer.team, scorer.goal_time]
          );
        }
      }

      // Commit the transaction if no errors
      await client.query('COMMIT');
      
      // Return success response
      return res.status(201).json({ message: 'Match added successfully', matchId });

    } catch (err) {
      // If any error occurs, roll back the transaction to prevent inconsistent state
      await client.query('ROLLBACK');
      console.error('Error adding match:', err);  // Log error details for debugging
      res.status(500).json({ error: 'Failed to add match', message: err.message });
    } finally {
      // Release the client connection back to the pool
      client.release();
    }
  } else {
    // Handle unsupported request methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
