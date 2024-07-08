
const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient();

const createOrganization = async (req, res) => {
    const { name, description } = req.body;

    const missingFields = [];
    if (!name) missingFields.push('name');
    if (missingFields.length > 0) {
        return res.status(422).json({
            errors: missingFields.map(field => ({ field, message: `${field} is required` }))
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
            data: {
                name: organisation.name,
                description: organisation.description
            }
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