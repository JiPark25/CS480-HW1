import axios from "axios";
let port = 3000;
let host = "localhost";
let protocol = "http";
let baseUrl = `${protocol}://${host}:${port}`;
//POST Request to insert an author into a database
//All the fields are required
//Return a success message if no error occurs
test("POST /authors returns a success message", async () => {
    let id = "1";
    let name = "Tolstoy";
    let bio = "Russian Writier";
    let result = await axios.post(`${baseUrl}/authors`, { id, name, bio });
    expect(result.data).toEqual({ message: "Post Success" });
});
//POST Request to insert a book into a database
//All the fields are required
//Return a success message if no error occurs
test("POST /books returns a success message", async () => {
    let id = "1";
    let author_id = "1";
    let title = "Resurrection";
    let pub_year = "2012";
    let genre = "fiction";
    let result = await axios.post(`${baseUrl}/books`, { id, author_id, title, pub_year, genre });
    expect(result.data).toEqual({ message: "Post Success" });
});
//GET Request to fetch a single book by its id
//Return 200 status code if no error occurs
test("Check GET /books/:id returns 200 status code", async () => {
    let id = "1";
    let response = await axios.get(`${baseUrl}/books/${id}`);
    expect(response.status).toEqual(200);
});
//GET Request to fetch a single author by his or her id
//Return 200 status code if no error occurs
test("Check GET /authors/:id returns 200 status code", async () => {
    let id = "1";
    let response = await axios.get(`${baseUrl}/authors/${id}`);
    expect(response.status).toEqual(200);
});
//GET Request to fetch all the books published in a given year
//Return 200 status code if no error occurs
test("Check GET /books returns 200 status code", async () => {
    let pub_year = "2012";
    let response = await axios.get(`${baseUrl}/books?pub_year=${pub_year}`);
    expect(response.status).toEqual(200);
});
//GET Request to fetch all the authors with a given name 
//Return 200 status code if no error occurs
test("Check GET /authors returns 200 status code", async () => {
    let name = "Tolstoy";
    let response = await axios.get(`${baseUrl}/authors?name=${name}`);
    expect(response.status).toEqual(200);
});
//GET Requesst to fetch all the books
//Return 200 status code if no error occurs
test("GET /books/showall returns 200 status code", async () => {
    let response = await axios.get(`${baseUrl}/books/showall`);
    console.log(response);
    expect(response.status).toEqual(200);
});
//GET Request to fetch all the authors
//Return 200 status code if no error occurs
test("GET /authors/showall returns 200 status code", async () => {
    let response = await axios.get(`${baseUrl}/authors/showall`);
    expect(response.status).toEqual(200);
});
//DELETE Request to delete a book given its id
//Return 202 status code if accepted
test("DELETE /books/:id returns 202 status code", async () => {
    let id = 1;
    let response = await axios.delete(`${baseUrl}/books/${id}`);
    expect(response.status).toEqual(202);
});
//DELETE Request to delete an author given his or her 
//Return 202 status code if accepted
test("DELETE /authors/:id returns 202 status code", async () => {
    let id = 1;
    let response = await axios.delete(`${baseUrl}/authors/${id}`);
    expect(response.status).toEqual(202);
});
