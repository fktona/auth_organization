const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const validateUser = async (req, res, next) => {
    const { firstName, lastName, email, password , phone } = req.body;
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

      const missingFields = [];
  if (!firstName) missingFields.push('firstName');
  if (!lastName) missingFields.push('lastName');
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');
    if (!phone) missingFields.push('phone');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({
      errors: [{ field: 'email', message: 'email is invalid' }]
    });
  }

  if (missingFields.length > 0) {
    return res.status(422).json({
      errors: missingFields.map(field => ({ field, message: `${field} is required` }))
    });
  }

  
    next();
};

module.exports = validateUser;