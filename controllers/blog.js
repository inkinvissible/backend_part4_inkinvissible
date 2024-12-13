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
    const tokenDecoded = jwt.verify(request.token, process.env.SECRET)

    if (!tokenDecoded.id) return response.status(401).json({ error: 'Token missing or invalid' })

    const user = await User.findById(tokenDecoded.id)

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
    const tokenDecoded = jwt.verify(request.token, process.env.SECRET)
    if (!tokenDecoded.id) return response.status(401).json({ error: 'Token missing or invalid' })

    const userId = tokenDecoded.id
    console.log('UserId from decoded token', userId)
    
    const blogId = request.params.id
    console.log('BlogId from the parameters', blogId)
    
    const blog = await Blog.findById(blogId)
    console.log('Blog from find by ID', blog)
    console.log('User desde blog from ID', blog.user.toString())
    
    
    
    if (blog.user.toString() === userId) {
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