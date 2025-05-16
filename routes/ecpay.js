const express = require("express");
const router = express.Router();
const pool = require("../db");

// 綠界付款通知接收（NotifyURL）
router.post("/notify", async (req, res) => {
  try {
    const data = req.body;

    const {
      MerchantTradeNo,
      TradeAmt,
      PaymentDate,
      PaymentType,
      RtnMsg,
      RtnCode,
      CustomField1, // ✅ 這裡就是商品名稱
    } = data;

    if (RtnCode === "1") {
      await pool.query(
        `INSERT INTO tradetest (order_no, amount, payment_date, payment_type, rtn_msg, item_name)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          MerchantTradeNo,
          parseInt(TradeAmt),
          PaymentDate,
          PaymentType,
          RtnMsg,
          CustomField1 || "（未傳入商品名稱）",
        ]
      );

      console.log(`✅ 訂單 ${MerchantTradeNo} 寫入成功，商品：${CustomField1}`);
    }

    res.send("1|OK");
  } catch (err) {
    console.error("❌ 寫入資料庫失敗：", err);
    res.status(500).send("0|ERROR");
  }
});

module.exports = router;
