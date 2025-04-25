require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");
const { Pool } = require("pg");

const sql = neon(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// 用 pool 查詢當前時間
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ 連線失敗:", err);
  } else {
    console.log("✅ 成功連線！現在時間是：", res.rows[0]);
  }
});
