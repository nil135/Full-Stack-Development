import express from "express"
const app = express()
const port = 5000

app.get("/", (req, res) => {
     res.send("<h1>Hello World!</h1>");
});

app.get("/about", (req, res) => {
     res.send("<h1>This is About Us Page.</h1>");
});

app.post("/register", (req, res) => {
     res.sendStatus(201);
});

app.put("/user/nilesh", (req, res) => {
     res.sendStatus(200);
});

app.patch("/user/nilesh", (req, res) => {
     res.sendStatus(200);
});

app.delete("/user/nilesh", (req, res) => {
     res.sendStatus(200);
});

app.listen(port, () => {
     console.log(`Server started on port ${port}`)
})