const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const addUserToOrg = async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;

    if (!userId || !orgId) {
        return res.status(422).json({
            errors: [
                { field: "userId", message: "User ID is required" }
            ]
        });
    }

    // Check if the organization exists
    const orgExists = await prismaClient.organisation.findUnique({
        where: {  orgId },
    });

    if (!orgExists) {
        return res.status(404).json({
            status: "Not Found",
            message: "Organization not found",
            statusCode: 404
        });
    }

    // Check if the user exists
    const userExists = await prismaClient.user.findUnique({
        where: {  userId },
    });

    if (!userExists) {
        return res.status(404).json({
            status: "Not Found",
            message: "User not found",
            statusCode: 404
        });
    }

    // Check if the user is already in the organization
    const userInOrg = await prismaClient.organisation.findFirst({
        where: {
             orgId,
            users: {
                some: {  userId }
            }
        }
    });

    if (userInOrg) {
        return res.status(409).json({
            status: "Conflict",
            message: "User is already a member of the organization",
            statusCode: 409
        });
    }

    try {
        await prismaClient.organisation.update({
            where: {  orgId },
            data: { users: { connect: {  userId } } }
        });
        res.status(200).json({
            status: "Success",
            message: "User added to organization successfully"
        });
    } catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            error: error.message,
            statusCode: 400
        });
    }
}

module.exports = addUserToOrg;
