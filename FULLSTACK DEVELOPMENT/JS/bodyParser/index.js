import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 5000;
let bandName = "";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Add this middleware after bodyParser:
app.use(session({
     secret: "your-secret-key", // Change this to a strong secret
     resave: false,
     saveUninitialized: true
}));

// Custom middleware to generate bandName
function bandNameGenerator(req, res, next) {
     if (req.method === "POST") {
          // Ensure req.body.uname and req.body.pass exist before accessing
          if (req.body.uname && req.body.pass) {
               bandName = req.body.uname + " " + req.body.pass;
               console.log("bandName:", bandName);
          } else {
               console.log("Missing uname or pass in request body");
          }
     }
     next();
}

// Middleware to check user credentials
function checkUserCreds(req, res, next) {
     if (req.method === "POST") {
          // Check if req.body.pass exists and matches the expected password
          if (req.body.pass && req.body.pass === "123") {
               req.session.authorized = true;
               next();
          } else {
               res.sendFile(__dirname + "/public/index.html");
          }
     } else {
          next(); // Allow non-POST requests to continue
     }
}

app.use(bandNameGenerator);
app.use(checkUserCreds);

// Routes
app.get("/", (req, res) => {
     res.sendFile(__dirname + "/public/index.html");
     req.session.destroy();
});

app.post("/submit", (req, res) => {
     console.log("body-parser reqbody", req.body);
     // If authentication is successful, redirect to /home
     if (req.session.authorized) {
          res.redirect("/home");
     } else {
          req.session.destroy();
          res.redirect("/"); // Redirect back to login if not authorized          
     }
});

app.get("/home", (req, res) => {
     if (req.session.authorized) {
          res.sendFile(__dirname + "/public/homepage.html");
     } else {
          req.session.destroy();
          res.redirect("/"); // Redirect back to login if not authorized
     }
});

// Catch-all route for 404 errors (must be after all other routes)
app.use((req, res) => {
     res.status(404).sendFile(__dirname + "/public/404.html");
     req.session.destroy();
     res.redirect("/"); // Redirect back to login if not authorized
});

app.listen(port, () => {
     console.log(`Server started on port ${port}`);
});