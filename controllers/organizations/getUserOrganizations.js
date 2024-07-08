const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const res = require('express/lib/response');
const prisma = new PrismaClient();

const getUserOrganisations = async (userId) => {
    try {
        const createdOrganisations = await prisma.organisation.findMany({
            where: { createdBy: userId },
        });

      const createdorg =  createdOrganisations.map(({ createdBy, ...rest }) => rest);

        const user = await prisma.user.findUnique({
            where: { userId },
            include: { organisations: true }
        });

        
        const organisationsBelongingTo = user.organisations.map(({ createdBy, ...rest }) => rest);

        return { 
            createdOrganisations: createdorg, 
            organisationsBelongingTo
        };
    } catch (error) {
        
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
    const usersOrganization =  async (req, res) => {
    try {
        const userId = req.userId;
        const { createdOrganisations, organisationsBelongingTo } = await getUserOrganisations(userId);

        const allOrganisations = [...createdOrganisations, ...organisationsBelongingTo];

        
        console.log(response);

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
