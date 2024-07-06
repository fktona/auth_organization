const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); 

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }


    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            console.error(error);
            return res.status(500).json({ message: 'An error occurred while validating the token' });
        }
    }
};

module.exports = authMiddleware;
