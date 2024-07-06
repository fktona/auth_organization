const request = require('supertest');
const {app,server} = require('../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('User Authentication and Organisation Creation', () => {
    beforeEach(async () => {
        await prisma.organisation.deleteMany({});
       await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
        server.close();
    });

    it('Register user successfully and create a default organisation', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'joohn.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe('joohn.doe@example.com');
        expect(response.body.data.user.firstName).toBe('John');
        expect(response.body.data.accessToken).toBeDefined();
    });

    it('Verify the default organisation name is correctly generated', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jan.smith@example.com',
                password: 'password123',
                phone: '0987654321'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe('jan.smith@example.com');

        const orgResponse = await request(app)
            .get('/api/organisations')
            .set('Authorization', `${response.body.data.accessToken}`);

        const userOrg = orgResponse.body.data.organisations.find(org => org.name === "Jane's Organisation");
        expect(userOrg).toBeDefined();
        expect(userOrg.name).toBe("Jane's Organisation");
    });

    it('Fail if email already exists', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe', 
                email: 'jan.smith@example.com',
                password: 'password123',
                phone: '1234567890',
            });

        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jan.smith@example.com',
                password: 'password123',
                phone: '0987654321' 
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Email already exists');
    });

    it('Log the user in successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'joohn.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'joohn.doe@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data.user.email).toBe('joohn.doe@example.com');
        expect(response.body.data.accessToken).toBeDefined();
    });

    it('Fail to log the user in with incorrect credentials', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john2@gma.co',
                password: 'password',
                phone: '1234567890'
            });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'joh22@gmail.com',
                password: 'password'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('Bad request');
    });

    it('Fail if required fields are missing', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                email: 'missing.fields@example.com'
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('Fail if there’s duplicate email or userId', async () => {
        // Register first user
        await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'joohn.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });

        // Attempt to register second user with the same email
        const response = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'joohn.doe@example.com',
                password: 'password123',
                phone: '0987654321'
            });

        expect(response.statusCode).toBe(422);
    });
});

