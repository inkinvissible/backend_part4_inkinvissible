const Blog = require('../models/blog')
const User = require('../models/users')
const bcrypt = require('bcrypt')

const initialBlogs = [
    {
        "title": "Comprar Bitcoins",
        "author": "Satoshi Nakamoto",
        "url": "https://google.com",
        "likes": 3
    },
    {
        "title": "La importancia del console.log() en Web Development",
        "author": "Anna Gety",
        "url": "https://google.com",
        "likes": 5
    }
]

const initialUsers = [
    {
        "username": "inkinvissible",
        "name": "Bestuser",
        "password": "bestuser",
        "passwordHash": bcrypt.hashSync('bestuser', 10)
    },
    {
        "username": "root",
        "name": "Superuser",
        "password": "user",
        "passwordHash": bcrypt.hashSync('user', 10)
    }
]

const blogsInDb = async () =>{
    const blogs = await Blog.find({})
    return blogs.map(note => note.toJSON())
}

const usersInDb = async () =>{
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    blogsInDb, initialBlogs, initialUsers, usersInDb
}