const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('the most liked author is Anna Gety', () => {
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
    },
    {
      "title": "La importancia del Web Development",
      "author": "Anna Gety",
      "url": "https://google.com",
      "likes": 3
    }
  ]

  const mostLikedAuthor = listHelper.mostLikes(initialBlogs)

  assert.strictEqual(mostLikedAuthor.author, "Anna Gety")
})

test('the most blogs are from Anna Gety', () => {
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
    },
    {
      "title": "La importancia del Web Development",
      "author": "Anna Gety",
      "url": "https://google.com",
      "likes": 3
    }
  ]

  const mostBlogsAuthor = listHelper.mostBlogs(initialBlogs)
  assert.strictEqual(mostBlogsAuthor.author, "Anna Gety")
})