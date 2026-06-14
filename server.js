const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors());
app.use(express.json());

// Yahan aapne apna asli Ezytm API Token daal diya hai
const EZYTM_API_TOKEN = "F789693c-8e39-465f-94a5-70bd83609f56";

app.post('/api/recharge', async (req, res) => {
    const { mobile, operator, amount } = req.body;

    // 🔴 IMPORTANT: Yahan 'XXXX' ki jagah Ezytm se dekh kar asli codes daalne honge
    const operatorCodes = {
        "jio": "12", 
        "airtel": "1",
        "vi": "10",
        "bsnl": "13"
    };

    const opId = operatorCodes[operator.toLowerCase()];
    
    // Aapke app ki taraf se ek unique Request ID
    const refTxnId = "APP" + Date.now(); 

    // Ezytm API URL (Aapke screenshot ke hisaab se)
    const ezytmUrl = `https://newapi.ezytm.in/Service/Recharge2?ApiToken=${EZYTM_API_TOKEN}&MobileNo=${mobile}&Amount=${amount}&OpId=${opId}&RefTxnId=${refTxnId}`;

    try {
        // Asli server ko request bhejna (Node.js fetch)
        const response = await fetch(ezytmUrl);
        const data = await response.json();

        // Ezytm ka Status Check (Screenshot ke hisaab se: 1 = Success)
        if (data.STATUS === 1) {
            res.json({
                status: "Success",
                transactionId: data.OPTXNID, 
                message: `Recharge Successful! Ezytm TXN: ${data.TXNNO}`
            });
        } else {
            // Agar API ne fail bola (jaise balance na ho ya number galat ho)
            res.json({
                status: "Failed",
                transactionId: null,
                message: data.MESSAGE || "Recharge fail ho gaya."
            });
        }

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ status: "Failed", message: "Server connection error." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Live Server port ${PORT} par chal raha hai!`);
});
