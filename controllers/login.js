const bcrypt = require('bcryptjs');
const generateToken = require('../middlewares/generateToken');


const { PrismaClient } = require('@prisma/client');   
const e = require('express');
require('dotenv').config();
const prismaClient = new PrismaClient();

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prismaClient.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: "Bad request",
                message: "Authentication failed",
                error:error.message,
                statusCode: 401
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            status: "success",
            message: "Login successful",
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
            message: "Authentication failed",
            error: error.message,
            statusCode: 401
        });
    }
}

module.exports = login;