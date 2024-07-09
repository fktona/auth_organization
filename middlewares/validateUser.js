const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const { parsePhoneNumberFromString, isPossiblePhoneNumber ,  } = require('libphonenumber-js');

const validateUser = async (req, res, next) => {
    const { firstName, lastName, email, password, phone } = req.body;
    
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

    let parsedPhone;
    try {
        parsedPhone = parsePhoneNumberFromString(phone);

        if (!parsedPhone || !parsedPhone.isValid()) {
            const defaultCountryCode = 'NG'; 
            parsedPhone = parsePhoneNumberFromString(phone, defaultCountryCode);
        }
    } catch (error) {
        return res.status(422).json({
            errors: [{ field: 'phone', message: 'Phone must be a valid international or local number' }]
        });
    }
   console.log(parsedPhone);
    if (!parsedPhone || !parsedPhone.isValid() || !isPossiblePhoneNumber(parsedPhone.number) || phone.length < 8 || phone.length > 15) {
        return res.status(422).json({
            errors: [{ field: 'phone', message: 'Phone must be a valid international or local number' }]
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(422).json({
            errors: [{ field: 'email', message: 'Email is invalid' }]
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
