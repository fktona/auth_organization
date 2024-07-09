const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const getUserRecord = async (req, res) => {
    const userId = req.userId; 
    const { id } = req.params; 
    if (!id || !userId) {
        return res.status(400).json({
            status: "Bad request",
            message: "User ID is required",
            statusCode: 400
        });
    }

    try {
        // Find the user requesting the information
        const requestingUser = await prismaClient.user.findUnique({
            where: { userId: userId },
            include: {
                organisations: true // Include the organizations the requesting user belongs to
            }
        });

        if (!requestingUser) {
            return res.status(404).json({
                status: "Not found",
                message: "Requesting user not found",
                statusCode: 404
            });
        }

        // Find the user whose record is being requested
        const requestedUser = await prismaClient.user.findUnique({
            where: { userId: id },
            include: {
                organisations: true
            }
        });

        if (!requestedUser) {
            return res.status(404).json({
                status: "Not found",
                message: "Requested user not found",
                statusCode: 404
            });
        }

        const {organisations,password, ...userData} = requestedUser;
        console.log(userData)

        if (!requestedUser) {
            return res.status(404).json({
                status: "Not found",
                message: "Requested user not found",
                statusCode: 404
            });
        }

    
        if (userId === id) {
            return res.status(200).json({
                status: "success",
                message: "User found",
                data: userData
            });
        }

    
        const commonOrganisations = requestingUser.organisations.filter(org =>
            requestedUser.organisations.some(requestedOrg => requestedOrg.orgId === org.orgId)
        );

        if (commonOrganisations.length === 0) {
            return res.status(403).json({
                status: "Forbidden",
                message: "You do not have access to this user's records",
                statusCode: 403
            });
        }

        res.status(200).json({
            status: "success",
            message: "User found",
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: "Error retrieving user",
            statusCode: 500,
            error: error.message
        });
    }
}

module.exports = getUserRecord;
