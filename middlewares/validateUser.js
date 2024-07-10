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


//     let parsedPhone;
//     try {
//         parsedPhone = parsePhoneNumberFromString(phone);

//         if (!parsedPhone || !parsedPhone.isValid()) {
//             const defaultCountryCode = 'NG'; 
//             parsedPhone = parsePhoneNumberFromString(phone, defaultCountryCode);
//         }
//     } catch (error) {
//         return res.status(422).json({
//             errors: [{ field: 'phone', message: 'Phone must be a valid international or local number' }]
//         });
//     }
//    console.log(parsedPhone);
//     if (!parsedPhone || !parsedPhone.isValid() || !isPossiblePhoneNumber(parsedPhone.number) || parsedPhone.number.length < 8 || parsedPhone.number.length > 15) {
//         return res.status(422).json({
//             errors: [{ field: 'phone', message: 'Phone must be a valid international or local number' }]
//         });
//     }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(422).json({
            errors: [{ field: 'email', message: 'Email is invalid' }]
        });
    }


    
//     if (password.length < 4) {
//       return res.status(422).json({
//           errors: [{ field: 'password', message: 'Password must be at least 4 characters' }]
//       });
//   }
    const existingUser = await prismaClient.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }

    next();
};

module.exports = validateUser;
