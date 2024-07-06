const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const getUserRecord = async (req, res) => {
    
    const { id } = req.params;
    try {
        const user = await prismaClient.user.findUnique({ where: { userId: id } });
        if (!user) {
            return res.status(404).json({
                status: "Not found",
                message: "User not found",
                statusCode: 404
            });
        }
        res.status(200).json({
            status: "success",
            message: "User found",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Error retrieving user",
            statusCode: 400
        });
    }
}

module.exports = getUserRecord;