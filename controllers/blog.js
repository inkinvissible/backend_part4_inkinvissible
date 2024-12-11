const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    if (!blog.likes) blog.likes = 0
    if (!blog.title || !blog.url) {
        response.status(400).end()
    } else {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }

})

blogRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {
        response.status(204).end()
    } else {
        response.status(404).json({ error: 'Blog not found' })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const { likes } = request.body
    if (likes === undefined) return response.status(400).json({ error: 'Likes are required' })
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, {new: true})
    updatedBlog ? response.status(200).json(updatedBlog) :  response.status(404).json({ error: 'Blog not found' })
})

module.exports = blogRouter