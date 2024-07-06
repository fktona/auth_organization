const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserOrganisations = async (userId) => {
    try {
    
        const createdOrganisations = await prisma.organisation.findMany({
            where: { createdBy: userId },
        });

    
        const user = await prisma.user.findUnique({
            where: { userId },
            include: { organisations: true }
        });

        return { 
            createdOrganisations, 
            organisationsBelongingTo: user.organisations 
        };
    } catch (error) {
        throw new Error('Error fetching organisations');
    }
};

    const usersOrganization =  async (req, res) => {
    try {
        const userId = req.userId;
        const { createdOrganisations, organisationsBelongingTo } = await getUserOrganisations(userId);

        const allOrganisations = [...createdOrganisations, ...organisationsBelongingTo];

        res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: {
                organisations: allOrganisations
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}

module.exports = usersOrganization;
