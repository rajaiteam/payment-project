const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// 🔹 Payment Create API
app.post('/create-payment', async (req, res) => {
  try {
    
    const orderId = "ORD_" + Date.now();

    const response = await axios.post(
      "https://api.paymentgateway.com/create-order", // 👉 Yahan apna real gateway URL daalo
      {
        merchant_id: "100222010",
        amount: 100,
        currency: "INR",
        order_id: orderId,
        redirect_url: "http://localhost:3000/success.html",
        cancel_url: "http://localhost:3000/cancel.html"
      },
      {
        headers: {
          "Authorization": "cadef6ef9ef5599988fd9dd5d880645a",
          "Content-Type": "application/json"
        }
      }
    );

    // 🔹 Payment Link return
    res.json({
      payment_url: response.data.payment_link
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).send("Payment Error");
  }
});


// 🔹 Server Start
app.listen(3000, () => {
  console.log("Server running: http://localhost:3000");
});
