import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for posts
let posts = [];

// Route for homepage
app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

// Route to create a new post
app.get("/create", (req, res) => {
    res.render("create.ejs");
});

// Route to save a new post
app.post("/create", (req, res) => {
    const { title, content } = req.body;
    const id = posts.length > 0 ? posts[posts.length-1].id + 1 : 1; //Generate ID from the last post or 1 if empty
    const post = { id, title, content }; // Post id is generated here
    posts.push(post);
    res.redirect("/");
});

// Route to edit an existing post
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("edit.ejs", { post, id });
});


// Route to save changes to a post
app.post("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const postIndex = posts.findIndex(post => post.id === id);
     if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    res.redirect("/");
});

// Route to delete a post
app.get("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    posts = posts.filter(post => post.id !== id);
    res.redirect("/");
});

// Route to get a single post
app.get("/post/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(post => post.id === id);
     if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("post.ejs", { post });
});


// Set views directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});