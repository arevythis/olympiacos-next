const { Client } = require('pg'); // For PostgreSQL

const testConnection = async () => {
  const client = new Client({
    connectionString:'postgresql://postgres:JqhMCyobsOFiAiXg@db.hsnmfpkitybsxdizqoin.supabase.co:5432/postgres',
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