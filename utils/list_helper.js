const _ = require('lodash')
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((total, num) => total + num.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) { return null }
    return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
}

const mostLikes = (blogs) => {
    const groupedAuthors = _.groupBy(blogs, 'author')
    
    const totalLikesAuthor = _.mapValues(groupedAuthors, (blog, author) =>({
        author: author,
        likes: _.sumBy(blog, 'likes')
    }))
    const totalLikesArray = _.map(totalLikesAuthor, (value, key) => ({
        author: key,
        likes: value.likes
    }))
    
    const mostLikedAuthor = _.maxBy(totalLikesArray, 'likes')
    return mostLikedAuthor
}

const mostBlogs = (blogs) => {
    const groupedAuthors = _.groupBy(blogs, 'author')
    
    const totalBlogsAuthor = _.mapValues(groupedAuthors, (blog, author) =>({
        author: author,
        blogs: blog.length
    }))

    const totalBlogsArray = _.map(totalBlogsAuthor, (value, key) => ({
        author: key,
        blogs: value.blogs
    }))

    const mostBlogsAuthor = _.maxBy(totalBlogsArray, 'blogs')
    return mostBlogsAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs
}