const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 ENV Variables (Render Dashboard me set karna)
const API_KEY = process.env.API_KEY;
const MERCHANT_ID = process.env.MERCHANT_ID;

// 🔹 Home Route (optional safety)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 Create Payment API
app.post('/create-payment', async (req, res) => {
  try {
    const orderId = "ORD_" + Date.now();

    const response = await axios.post(
      "https://api.jazpays.com/v1/create", // 👉 Apna real API URL daalo
      {
        merchant_id: MERCHANT_ID,
        amount: 100, // ₹100 (change kar sakte ho)
        currency: "INR",
        order_id: orderId,
        redirect_url: "https://YOUR-APP.onrender.com/success.html",
        cancel_url: "https://YOUR-APP.onrender.com/cancel.html"
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 🔹 Payment link return
    res.json({
      payment_url: response.data.payment_link
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "Payment creation failed"
    });
  }
});

// 🔹 PORT (Render ke liye IMPORTANT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
