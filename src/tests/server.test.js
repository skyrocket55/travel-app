const supertest = require('supertest');
const app = require('../server/server');
const request = supertest(app);

describe('Test Routes', () => {
    it ('GET home page', async done => {
        const res =  await request.get('/')
        expect(res.status).toBe(200);
        done();
    })
})
