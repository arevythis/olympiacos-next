import { Pool } from 'pg';
import bcrypt from 'bcryptjs'; // bcrypt import
import jwt from 'jsonwebtoken'; // jsonwebtoken import

// Initialize PostgreSQL connection pool using environment variables
const pool = new Pool({
  connectionString:'postgresql://postgres:JqhMCyobsOFiAiXg@db.hsnmfpkitybsxdizqoin.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false, // Required for connecting to Supabase
         // Enforces SSL connection to the database
  },
});

// Retrieve JWT secret from environment variables
const JWT_SECRET ='Vf90g1Hhvft6nMJ08A9fdX3t27L99xqXp';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Query to find the user by username
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      // If no user found
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Compare password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If password is valid, generate JWT token
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Respond with success and the generated JWT token
        res.json({
          success: true,
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      } else {
        // If password is not valid, return a 400 status with an invalid credentials message
        res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      // Catch all errors and log them for debugging
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  } else {
    // Respond with 405 for any non-POST method
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
