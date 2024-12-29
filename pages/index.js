const { Client } = require('pg'); // For PostgreSQL

const testConnection = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // Ensure this variable is configured in Vercel
    ssl: { rejectUnauthorized: false }, // Adjust SSL settings as needed
  });

  try {
    await client.connect();
    console.log("Connected to database successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await client.end();
  }
};

testConnection();
export default function k(){
    return(<div>ok</div>)
};