
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const addUserToOrg = async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(422).json({
            errors: [
                { field: "userId", message: "User ID is required" }
            ]
        });
    }
    try {
        await prismaClient.organisation.update({
            where: { orgId },
            data: { users: { connect: { userId } } }
        });
        res.status(200).json({
            status: "success",
            message: "User added to organisation successfully"
        });
    } catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Client error",
            error: error.message,
            statusCode: 400
        });
    }
}

module.exports = addUserToOrg;