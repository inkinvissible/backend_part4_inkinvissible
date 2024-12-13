const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const assert = require('assert')
const User = require('../models/users')

const api = supertest(app)

describe('tests of the api users', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const userObject = helper.initialUsers.map(user => new User(user))
        const promiseArray = userObject.map(user => user.save())
        await Promise.all(promiseArray)

    })

    test('a user with a 2 characters password is not created', async () => {
        const user = {
            username: "mluuu",
            name: "Bestuser",
            password: "bs"
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        assert.strictEqual(response.body.error, "The password must have 3 or more characters")
    })

    test('a user with a 2 characters username is not created', async () => {
        const user = {
            username: "ml",
            name: "Bestuser",
            password: "bsaas"
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        
        assert.strictEqual(response.body.error.includes('is shorter than the minimum allowed length'), true)
    })

    test('a user with repeated username is not created', async () => {
        const user = {
            username: "inkinvissible",
            name: "Bestuser",
            password: "bsas"
        }

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)

        assert.strictEqual(response.body.error, 'expected `username` to be unique')
    })

    after(async () => {

        await mongoose.connection.close()

    })

})