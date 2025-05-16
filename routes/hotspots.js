const express = require("express");
const router = express.Router();
const pool = require("../db"); // ✅ 連線到 Neon 的 Pool

// GET /api/hotspots - 回傳景點資料
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
       SELECT cname, img_url, description FROM sight ORDER BY sight_id LIMIT 8
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ 抓取 hot_spots 資料失敗：", err);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

// GET /api/hotspots/summary - 回傳路線摘要資料
router.get("/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT name, length,  
        CASE difficulty
          WHEN 1 THEN '新手'
          WHEN 2 THEN '中等'
          WHEN 3 THEN '困難'
          ELSE '未知'
        END AS difficulty,
        route_id, pricing, img, feature 
      FROM routes 
      ORDER BY route_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ 抓取 summary 失敗：", err);
    res.status(500).json({ error: "伺服器錯誤" });
  }
});

module.exports = router;
