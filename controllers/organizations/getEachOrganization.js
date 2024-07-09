
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();
const getEachOrganization = async (req, res) => {
    const { orgId } = req.params;
    if (!orgId) {
        return res.status(400).json({
            status: "Bad request",
            message: "Organisation ID is required",
            statusCode: 400
        });
    }
    try {
        const organisation = await prismaClient.organisation.findUnique({ where: { orgId } });
        if (!organisation) {
            return res.status(404).json({
                status: "Not found",
                message: "Organisation not found",
                statusCode: 404
            });
        }
        res.status(200).json({
            status: "success",
            message: "Organisation found",
            data: organisation
        });
    } catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Error retrieving organisation",
            statusCode: 400
        });
    }
}


module.exports = getEachOrganization;