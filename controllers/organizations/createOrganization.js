
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const createOrganization = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(422).json({
            errors: [
                { field: "name", message: "Name is required" },
                { field: "description", message: "Description is required" }
            ]
        });
    }
    const createdBy = req.userId;  
    console.log(createdBy)
    try {
        const organisation = await prismaClient.organisation.create({
            data: { name, description , createdBy}
        });
        res.status(201).json({
            status: "success",
            message: "Organisation created successfully",
            data: organisation
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

module.exports = createOrganization;