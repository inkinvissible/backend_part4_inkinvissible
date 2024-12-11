const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((total, num) => total + num.likes, 0)
}

const favoriteBlog = (blogs) =>{
    if (blogs.length === 0){ return null}

    return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}