import express, { Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
import { allowedNodeEnvironmentFlags } from "process";

let app = express();
app.use(express.json());

// create database "connection"
// use absolute path to avoid this issue
// https://github.com/TryGhost/node-sqlite3/issues/441
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");

interface Success {
    message: string;
}
interface Error {
    error: string;
}
type myResponse = Response<Success | Error>;


//GET Request to fetch all the books 
app.get("/books/showall", async (req, res) => {
    try {
        let books = await db.all("SELECT * FROM books");
        return res.json(books);
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})

//GET Request to fetch all the authors 
app.get("/authors/showall", async (req, res) => {
    try {
        let authors = await db.all("SELECT * FROM authors");
        return res.json(authors);
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})

//DELETE Request to delete a book from the database given its id
app.delete("/books/:id", async (req, res) => {
    try {
        let bId = req.params.id;
        await db.run(`DELETE * FROM books WHERE id = ${bId}`);
        return res.status(202).json();
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }

})

//DELETE Request to delete an author from the database given his or her id 
app.delete("/authors/:id", async (req, res) => {
    try {
        let aId = req.params.id;
        await db.run(`DELETE * FROM authors WHERE id = ${aId}`);
        return res.status(202).json();
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }

})


//GET Request to fetch a single book by its id 
app.get("/books/:id", async (req, res) => {
    try {
        let bookId: string = req.params.id;
        let book = await db.all(`SELECT * FROM books WHERE id = ${bookId}`);
        return res.json(book);

    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})

//GET Request to fetch a single author by his or her id
app.get("/authors/:id", async (req, res) => {
    try {
        let authorId: string = req.params.id;
        let author = await db.all(`SELECT * FROM authors WHERE id = ${authorId}`);
        return res.json(author);
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})



//GET Request to fetch all the books published in a specific year  
app.get("/books", async (req, res) => {
    if (!req.query.pub_year) {
        return res.status(400).json({ error: "Published Year is required" });
    }

    try {
        let pub_year = req.query.pub_year;
        let filtered = await db.all(`SELECT * FROM books WHERE pub_year = ${pub_year}`);
        return res.json(filtered);
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})


//GET Request to fetch all the authors with a given name 
app.get("/authors", async (req, res) => {
    if (!req.query.name) {
        return res.status(400).json({ error: "name is required" });
    }
    try {
        let name = req.query.name;
        let filtered = await db.all(`SELECT * FROM authors WHERE name = "${name}"`);
        return res.json(filtered);
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})


//POST Request to insert a new book into a database
//All the fields are required
app.post("/books", async (req, res: myResponse) => {
    if (!req.body.id) {
        return res.status(400).json({ error: "id is required" });
    }
    if (!req.body.author_id) {
        return res.status(400).json({ error: "author_id is required" });
    }
    if (!req.body.title) {
        return res.status(400).json({ error: "title is required" });
    }
    if (!req.body.pub_year) {
        return res.status(400).json({ error: "pub_year is required" });
    }
    if (!req.body.genre) {
        return res.status(400).json({ error: "genre is required" });
    }

    let bookId: string = req.body.id;
    let bookAuthorId: string = req.body.author_id;
    let bookTitle: string = req.body.title;
    let bookPubYear: string = req.body.pub_year;
    let bookGenre: string = req.body.genre;

    try {
        let sql = await db.prepare("INSERT INTO books VALUES (?, ?, ?, ?, ?)");
        await sql.bind([bookId, bookAuthorId, bookTitle, bookPubYear, bookGenre]);
        await sql.run();
        return res.json({ message: "Post Success" })
    }
    catch (err) {
        return res.status(400).json()
    }

})

//POST Request to insert a new author into a database
//All the fields are required
app.post("/authors", async (req, res: myResponse) => {
    if (!req.body.id) {
        return res.status(400).json({ error: "id is required" });
    }
    if (!req.body.name) {
        return res.status(400).json({ error: "name is required" });
    }

    if (!req.body.bio) {
        return res.status(400).json({ error: "bio is required" });
    }

    let authorId: string = req.body.id;
    let authorName: string = req.body.name;
    let authorBio: string = req.body.bio;
    try {
        let sql = await db.prepare("INSERT INTO authors (id, name, bio) VALUES (?, ?, ?)");
        await sql.bind([authorId, authorName, authorBio]);
        await sql.run()
        return res.json({ message: "Post Success" });
    }
    catch (err) {
        return res.status(400).json({ error: `${err}` });
    }
})



// run server
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
