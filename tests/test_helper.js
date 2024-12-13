const Blog = require('../models/blog')
const User = require('../models/users')

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
        "password": "bestuser"
    },
    {
        "username": "root",
        "name": "Superuser",
        "password": "user"
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