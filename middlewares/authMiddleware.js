const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Removed duplicate token check

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.userId = decoded.id;
        next();
    } catch (error) {
        // Return a more detailed error message based on the type of JWT error
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        } else {
            // For unexpected errors, log the error and return a generic error message
            console.error(error);
            return res.status(500).json({ message: 'An error occurred while validating the token' });
        }
    }
};

module.exports = authMiddleware;