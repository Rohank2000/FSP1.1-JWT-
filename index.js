const express = require('express');
const cors = require('cors');
const JWT = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_VALUE = 'CONFIDENTIAL_KEY';
const JWT_Value = 'JWT_SIGNING_KEY';

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        res.json({ message: 'No token found' });
    }

    try {
        const verifiedToken = JWT.verify(token, JWT_Value);
        req.user = verifiedToken;
        next();
    } catch (error) {
        res.json({ message: "Invalid Token" });
    }
}


app.post('/admin/login', (req, res) => {
    const { secret } = req.body;
    if (secret === SECRET_VALUE) {
        const token_value = JWT.sign({ role: 'admin' }, JWT_Value, { expiresIn: "24h" });
        res.json({ token: token_value });
    } else {
        res.json({ message: "Access Denied" });
    }
});

app.get('/admin/api/data', authenticateJWT, (req, res) => {
    res.json({ message: "Protected route accessible" });
});

const PORT = 3000;

app.listen(PORT, () => console.log('server is running on ', PORT));