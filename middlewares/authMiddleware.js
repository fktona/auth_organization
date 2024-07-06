const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }


    console.log(token)  

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
