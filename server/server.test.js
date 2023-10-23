const request = require('supertest');
const app = require('./server')
const path = require('path');
const jwt = require('jsonwebtoken')
const config = require('config')

app.use('/api/generateToken', require('./routes/generateToken'));
app.use('/api/requests', require('./routes/requests'))

const filePath = path.join(__dirname, "testSupport", "testing.png")

describe('Generate Token', () => {
    it('POST /api/generateToken/ resource responds successfully', async () => {
        const response = await request(app).post('/api/generateToken').send({ username: "testing" });
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({expiresIn: "30 minutes"});
    });

    it('should return a 400 error for missing username', async () => {
        const response = await request(app).post('/api/generateToken').send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatch('Please provide a username');
    });
});

describe('API Router', () => {

    it('POST /api/requests/upload route successful', async () => {
        const token = jwt.sign({ username: 'testing' },config.get('jwtSecret'),{expiresIn: 1800})
        const response = await request(app).post('/api/requests/upload')
                                           .set('x-auth-token', token)
                                           .field('annotation', '123')
                                           .attach('files', filePath);
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({ annotation: "123", facesCount: 3, status: "successfully uploaded"});
    });

    it('should return a 400 error for missing token', async () => {
        const response = await request(app).post('/api/requests/upload')
                                           .field('annotation', '123')
                                           .attach('files', filePath);
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatch('No Token provided, authorization denied');
    });
    
    it('GET /api/requests route responds successfully', async () => {
        const token = jwt.sign({ username: 'testing' },config.get('jwtSecret'),{expiresIn: 1800})
        const response = await request(app).get('/api/requests').set('x-auth-token', token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({ data: [{ annotation: "123", facesCount: 3 }] })
    });

    it('should return a 400 error for missing token', async () => {
        const response = await request(app).get('/api/requests')
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatch('No Token provided, authorization denied');
    });


    it('GET /api/requests/admin route successful', async () => {
        const token = jwt.sign({ username: 'admin' },config.get('jwtSecret'),{expiresIn: 1800})
        const response = await request(app).get('/api/requests/admin')
                                           .set('x-auth-token', token)
        expect(response.statusCode).toBe(200)
        expect(response.body).toMatchObject({ data: [{ annotation: "123", facesCount: 3, username: "testing"}] });
    })

    it('should return a 400 error for missing token', async () => {
        const response = await request(app).get('/api/requests/admin')
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatch('No Token provided, authorization denied');
    });
});