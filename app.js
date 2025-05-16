// app.js（或 server.js）
const express = require("express");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

// 🧩 PostgreSQL 連線設定
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔗 路由模組
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const ecpayRouter = require("./routes/ecpay");
const hotSpotsRouter = require("./routes/hotspots");
// const likeroutesRouter = require('./routes/likeroutes'); // 如需使用可打開

// 🌍 CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// 🔧 Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// 📄 View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 🔗 路由掛載
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ecpay", ecpayRouter);
app.use("/api/hotspots", hotSpotsRouter);
// app.use('/api/likeroutes', likeroutesRouter); // 如需使用可打開

// 🧪 API：讀取 routes 資料
app.get("/route", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "routes"');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ 錯誤：", err);
    res.status(500).send("伺服器錯誤");
  }
});

// 🧪 API：讀取 cities 和 diary（原本 http.createServer 寫的內容）
app.get("/data", async (req, res) => {
  try {
    const result1 = await pool.query('SELECT * FROM "cities"');
    const result2 = await pool.query('SELECT * FROM "diary"');
    res.status(200).json({
      cities: result1.rows,
      diary: result2.rows,
    });
  } catch (err) {
    console.error("❌ 錯誤：", err);
    res.status(500).send("伺服器錯誤");
  }
});

// 🧪 測試首頁
app.get("/test", (req, res) => {
  res.send("Hello from Neon database backend");
});

// 🚫 404 處理
app.use(function (req, res, next) {
  next(createError(404));
});

// 🛠️ 錯誤處理
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3002, () => {
  console.log("✅ Server running at http://localhost:3002");
});

module.exports = app;
