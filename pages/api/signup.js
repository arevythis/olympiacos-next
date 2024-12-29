import { Pool } from 'pg';
import bcrypt from 'bcryptjs'; // bcrypt import for password hashing

// Use environment variables for the database connection
const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase SSL connection
    
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, email, password } = req.body;

      // Input Validation: Ensure required fields are provided
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if the email already exists in the database
      const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

      // Return success response
      res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error in signup:', error);
      res.status(500).json({ error: 'Something went wrong on the server.' });
    }
  } else {
    // Handle cases where method is not POST (405 - Method Not Allowed)
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
