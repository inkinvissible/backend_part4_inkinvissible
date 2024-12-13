const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (password.length >= 3) {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } else {
        response.status(400).json({ error: "The password must have 3 or more characters"})
    }

})

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs')
    console.log(users);
    response.json(users)
})

module.exports = usersRouter