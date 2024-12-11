const Blog = require('../models/blog')

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

const blogsInDb = async () =>{
    const blogs = await Blog.find({})
    return blogs.map(note => note.toJSON())
}

module.exports = {
    blogsInDb, initialBlogs
}