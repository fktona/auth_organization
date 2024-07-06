const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const dotenv = require('dotenv').config();



const generateToken = require('../middlewares/generateToken');
const signUp = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    

    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            }
        });

        const organisationName = `${firstName}'s Organisation`;
        await prismaClient.organisation.create({
            data: {
                name: organisationName,
                createdBy: user.userId,
                users: { connect: { userId: user.userId } }
            }
        });

        const token = generateToken(user);

        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400
        });
    }
}

module.exports = signUp;