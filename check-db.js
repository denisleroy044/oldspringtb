const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    for (const table of tables.rows) {
      console.log("\\nTable:", table.table_name);
      const columns = await pool.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
        [table.table_name]
      );
      columns.rows.forEach(c => console.log("  -", c.column_name, c.data_type));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
  pool.end();
}
check();
