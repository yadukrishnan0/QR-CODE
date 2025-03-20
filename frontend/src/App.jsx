import React, { useState } from "react";
import axios from "axios";
import { QrCode, Download, RefreshCw } from "lucide-react";

function App() {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!upiId || !amount || !name) {
      alert("Please enter all details");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await axios.post("http://localhost:5000/generate-payment-qr", {
        upiId,
        amount,
        name,
      });
      setQrCodeUrl(response.data.qrCodeUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.download = "payment_qrcode.png";
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <QrCode className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Payment QR Code Generator</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter UPI ID (e.g. 9876543210@upi)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter your name"
            />
          </div>

          <button
            onClick={generateQRCode}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </button>

          <div className="flex justify-center">
            {isGenerating ? (
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            ) : (
              qrCodeUrl && <img src={qrCodeUrl} alt="Payment QR Code" className="w-64 h-64" />
            )}
          </div>

          {qrCodeUrl && (
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={generateQRCode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
