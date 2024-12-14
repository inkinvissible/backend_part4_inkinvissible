const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const assert = require('assert')
const Blog = require('../models/blog')

const api = supertest(app)



describe('tests of api', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        const blogObject = helper.initialBlogs.map(blog => new Blog(blog))
        const promiseArray = blogObject.map(blog => blog.save())
        await Promise.all(promiseArray)
    })
    describe('tests with data in the database', () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('there are two blogs', async () => {
            const response = await api.get('/api/blogs')

            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('the first blog is about Comprar Bitcoin', async () => {
            const response = await api.get('/api/blogs')

            const titles = response.body.map(e => e.title)

            assert(titles.includes('Comprar Bitcoins'))
        })

        test('blogs have an ID', async () => {
            const response = await api.get('/api/blogs')
            response.body.map(blog => {
                assert(blog.id, 'Blog should have an id')
                assert.strictEqual(typeof blog.id, 'string')
                assert.strictEqual(blog._id, undefined)
            })
        })
    })

    describe('tests for adding data in the database', () => {
        test('a valid blog can be added', async () => {
            const newBlog = {
                "title": "Las ventajas de aprender",
                "author": "Mika Readovich",
                "url": "https://learn.com",
                "likes": 5
            }

            const request = {
                username: helper.initialUsers[0].username,
                password: helper.initialUsers[0].password
            }
            
            const response = await api
                .post('/api/login')
                .send(request)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: `Bearer ${response.body.token}`})
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const savedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
            assert.deepStrictEqual(savedBlog.title, newBlog.title)
        })

        test('a valid blog with no token can not be added', async () => {
            const newBlog = {
                "title": "Las ventajas de aprender",
                "author": "Mika Readovich",
                "url": "https://learn.com",
                "likes": 5
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(response.body.error, 'Token is missing or invalid')
        })

        test('likes have a value of 0 when it is not set in the request', async () => {
            const newBlog = {
                "title": "Las ventajas de emprender",
                "author": "Mika Readovich",
                "url": "https://learn.com",
            }
            const request = {
                username: helper.initialUsers[0].username,
                password: helper.initialUsers[0].password
            }
            
            const response = await api
                .post('/api/login')
                .send(request)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: `Bearer ${response.body.token}`})
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
        })

        test('an invalid request without title or url throws a bad request 400', async () => {
            const newBlog = {
                "author": "Mika Readovich",
                "likes": 5
            }

            const request = {
                username: helper.initialUsers[0].username,
                password: helper.initialUsers[0].password
            }
            
            const response = await api
                .post('/api/login')
                .send(request)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: `Bearer ${response.body.token}`})
                .expect(400)
        })
    })

    describe('tests for deleting data in the database', () => {
        test('deleting a blog successfully', async () => {
            const newBlog = {
                "title": "Las ventajas de emprender haciendo",
                "author": "Mika Readovich",
                "url": "https://learn.com",
                "likes": 5
            }
            const request = {
                username: helper.initialUsers[0].username,
                password: helper.initialUsers[0].password
            }
            
            const responseLogin = await api
                .post('/api/login')
                .send(request)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtStart = await helper.blogsInDb()

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: `Bearer ${responseLogin.body.token}`})
                .expect(201)
                

            const deleteId = response.body.id

            await api
                .delete(`/api/blogs/${deleteId}`)
                .set({ Authorization: `Bearer ${responseLogin.body.token}`})
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const deletedBlog = blogsAtEnd.find(b => b.id === deleteId)

            assert.strictEqual(deletedBlog, undefined)
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

        })
        test('a valid blog with no token can not be deleted', async () => {
            const newBlog = {
                "title": "Las ventajas de emprender haciendo",
                "author": "Mika Readovich",
                "url": "https://learn.com",
                "likes": 5
            }
            const request = {
                username: helper.initialUsers[0].username,
                password: helper.initialUsers[0].password
            }
            
            const responseLogin = await api
                .post('/api/login')
                .send(request)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtStart = await helper.blogsInDb()

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .set({ Authorization: `Bearer ${responseLogin.body.token}`})
                .expect(201)
                

            const deleteId = response.body.id

            const errorResponse = await api
                .delete(`/api/blogs/${deleteId}`)
                .expect(401)


            assert.strictEqual(errorResponse.body.error, 'Token is missing or invalid')

        })
    })

    describe('tests for updating data', async () => {
        test('updating a blog successfully', async () => {
            const blogs = await helper.blogsInDb()
            const blog = blogs[0]
            const likes = { "likes": 10 }

            const response = await api
                .put(`/api/blogs/${blog.id}`)
                .send(likes)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlog = blogsAtEnd.find(e => e.id === blog.id)
            assert.deepStrictEqual(updatedBlog.likes, likes.likes)
            assert.deepStrictEqual(updatedBlog.title, blog.title)
            assert.deepStrictEqual(updatedBlog.author, blog.author)
            assert.deepStrictEqual(updatedBlog.url, blog.url)
        })
    })

    after(async () => {
        await mongoose.connection.close()
    })

})