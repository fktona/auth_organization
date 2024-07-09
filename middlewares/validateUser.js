const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const validateUser = async (req, res, next) => {
    const { firstName, lastName, email, password , phone } = req.body;
    
  

      const missingFields = [];
  if (!firstName) missingFields.push('firstName');
  if (!lastName) missingFields.push('lastName');
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');
  

  if (missingFields.length > 0) {
    return res.status(422).json({
      errors: missingFields.map(field => ({ field, message: `${field} is required` }))
    });
  }
  
// Regex to validate international and local phone numbers, including various formats
    const phoneRegex = /^(\+?[1-9]\d{0,14}|0\d{9,10}|(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})$/;

if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
    return res.status(422).json({
        errors: [{ field: 'phone', message: 'Phone must be a valid international or local number' }]
    });
}

    
  
  

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({
      errors: [{ field: 'email', message: 'email is invalid' }]
    });
  }

const existingUser = await prismaClient.user.findUnique({
        where: { email }
      });
  
  if (existingUser) {
    return res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Email already exists',
      statusCode: 422
    });
  }

  
    next();
};

module.exports = validateUser;
