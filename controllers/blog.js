const blogRouter = require('express').Router()
exports.blogRouter = blogRouter
const Blog = require('../models/blog')
const User = require('../models/users')
const jwt = require('jsonwebtoken')




blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id
    })

    if (!blog.likes) blog.likes = 0
    if (!blog.title || !blog.url) {
        response.status(400).end()
    } else {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    }

})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'Token is missing or invalid' })
    }

    const blogId = request.params.id
    const blog = await Blog.findById(blogId)
    
    
    if (blog.user.toString() === user._id.toString()) {
        const blogResponse = await Blog.findByIdAndDelete(blogId)
        if (blogResponse) {
            response.status(204).end()
        } else {
            response.status(404).json({ error: 'Blog not found' })
        }
    } else {
        response.status(403).json({ error: 'Permission denied' })
    }

})

blogRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
    if (likes === undefined) return response.status(400).json({ error: 'Likes are required' })
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
    updatedBlog ? response.status(200).json(updatedBlog) : response.status(404).json({ error: 'Blog not found' })
})

module.exports = blogRouter