const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-payment-qr", async (req, res) => {
  try {
    const { upiId, amount, name } = req.body;

    if (!upiId || !amount || !name) {
      return res.status(400).json({ error: "UPI ID, Amount, and Name are required" });
    }

    // Format UPI payment URL
    const upiPaymentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=&tr=&tn=Payment&am=${amount}&cu=INR`;

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(upiPaymentUrl);

    res.json({ qrCodeUrl });
  } catch (error) {
    res.status(500).json({ error: "Error generating QR code" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
