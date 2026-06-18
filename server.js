const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/recharge', (req, res) => {
    const { mobile, operator, amount } = req.body;

    // 2 second ka fake delay taaki asli API jaisa feel aaye
    setTimeout(() => {
        // 90% chance of success (Dummy Logic)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            res.json({
                status: "Success",
                transactionId: "TXN" + Math.floor(Math.random() * 1000000000),
                message: `₹${amount} ka recharge ${operator} number ${mobile} par safal raha!`
            });
        } else {
            res.json({
                status: "Failed",
                transactionId: null,
                message: "Operator ka server down hai. Kripya thodi der baad try karein."
            });
        }
    }, 2000); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Dummy Backend Server port ${PORT} par chal raha hai!`);
});
