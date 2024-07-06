const request = require('supertest');
const {app,server} = require('../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('User Authentication and Organisation', () => {
    beforeEach(async () => {
        await prisma.organisation.deleteMany({});
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
        server.close();
    });

    it('Should register user successfully and create a default organisation', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe('john.doe@example.com');
        expect(response.body.data.user.firstName).toBe('John');
        expect(response.body.data.accessToken).toBeDefined();
    });

    it('Should verify the default organisation name is correctly generated', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                password: 'password123',
                phone: '0987654321'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe('jane.smith@example.com');

        const orgResponse = await request(app)
            .get('/api/organisations')
            .set('Authorization', `${response.body.data.accessToken}`);

        const userOrg = orgResponse.body.data.organisations.find(org => org.name === "Jane's Organisation");
        expect(userOrg).toBeDefined();
        expect(userOrg.name).toBe("Jane's Organisation");
    });

    it('Should log the user in successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe('john.doe@example.com');
        expect(response.body.data.accessToken).toBeDefined();
    });

    it('Should fail if required fields are missing', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'missing.fields@example.com'
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('Should fail if there’s duplicate email or userId', async () => {
        // Register first user
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        // Attempt to register second user with the same email
        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '0987654321'
            });

        expect(response.statusCode).toBe(422);
    });
});

