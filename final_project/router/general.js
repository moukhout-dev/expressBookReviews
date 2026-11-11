const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn
    res.send(books[ISBN]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    const keys = Object.keys(books);
    const matchingKeys = keys.filter((key) => {
        return books[key].author === author;
    });
    const matchingBooks = matchingKeys.map((key) => books[key]);
    res.send(matchingBooks)

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);
    const matchingKeys = keys.filter((key) => {
        return books[key].title === title;
    });
    const matchingBooks = matchingKeys.map((key) => books[key]);
    res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn]?.reviews;

    if (reviews === undefined) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(reviews);
});

module.exports.general = public_users;
