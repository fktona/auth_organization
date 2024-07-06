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

    // First, check if the userId exists in the database
    const userExists = await prismaClient.user.findUnique({
        where: { userId },
    });

    if (!userExists) {
        return res.status(404).json({
            status: "Not Found",
            message: "User not found",
            statusCode: 404
        });
    }

    try {
        await prismaClient.organisation.update({
            where: { orgId }, // Ensure this matches your schema's field name for organisation ID
            data: { users: { connect: { userId } } } // Ensure this matches your schema's relation and field names
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