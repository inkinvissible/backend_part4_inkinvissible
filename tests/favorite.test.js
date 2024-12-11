const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('max likes', () =>{
    const blogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a67623d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 25,
            __v: 0
        }, {
            _id: '5a422aa754a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 15,
            __v: 0
        }
    ]
    test('of blogs is the favorite with ID 5a422aa71b54a67623d17f8', () =>{
        const result = listHelper.favoriteBlog(blogs)
        console.log(result);
        console.log(blogs[1]);
        
        assert.deepStrictEqual(result, blogs[1])

    })
})