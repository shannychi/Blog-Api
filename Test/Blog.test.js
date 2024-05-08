const request = require('supertest');
const Blog = require("../routes/Blog")

describe('get /posts', () => {
    test('renders createBlog.ejs template', async () => {
        const response = await request(app).get('/posts');
        expect(response.status).toBe(200);
        expect(response.text).toContain('createBlog.ejs'); 
    });
   
}, 10000);

describe('post /posts', () => {
    test('creates a new blog post', async () => {
        const postData = {
            title: 'Test Post',
            content: 'Lorem ipsum dolor sit amet...',
            status: 'draft'
        };

        const token = 'mock-auth-token';

        const response = await request(Blog)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send(postData);

        expect(response.status).toBe(200);
        expect(response.header.location).toBe('/posts/drafts');
    });

}, 10000)


describe('get /posts/published', () => {
    test('returns published blog posts', async () => {
        const page = 1;

        const response = await request(Blog)
            .get('/posts/published')
            .query({ page });

        expect(response.status).toBe(200);

        expect(response.text).toContain('Published.ejs');

    });
  
});