const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn:  '24h',
    })
 return token;
};

module.exports = generateToken; 