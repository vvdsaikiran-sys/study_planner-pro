require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "study_planner"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("Connected to MySQL");
    }
});

app.get("/", (req, res) => {
    res.send("THIS IS MY NEW SERVER");
});
app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    const sql =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                message: "Registration Failed"
            });

        }

        res.json({
            message: "Registration Successful"
        });

    });

});
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                success: false,
                message: "Login Failed"
            });

        }

        if (result.length > 0) {

            return res.json({
                success: true,
                message: "Login Successful"
            });

        } else {

            return res.json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

    });

});
app.post("/addTask", (req, res) => {

    const { userEmail, task, priority, dueDate } = req.body;

    const sql = "INSERT INTO tasks (user_email, task, priority, due_date) VALUES (?, ?, ?, ?)";

    db.query(sql, [userEmail, task, priority, dueDate], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                message: "Task Not Added"
            });

        }

        res.json({
            message: "Task Added Successfully"
        });

    });

});
app.post("/getTasks", (req, res) => {

    const { userEmail } = req.body;

    const sql = "SELECT * FROM tasks WHERE user_email = ? ORDER BY id DESC";

    db.query(sql, [userEmail], (err, result) => {

        if (err) {

            console.log(err);

            return res.json([]);

        }

        res.json(result);

    });

});
app.post("/deleteTask", (req, res) => {

    const { id } = req.body;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                message: "Task Not Deleted"
            });

        }

        res.json({
            message: "Task Deleted Successfully"
        });

    });

});
app.post("/completeTask", (req, res) => {

    const { id, completed } = req.body;

    const sql = "UPDATE tasks SET completed = ? WHERE id = ?";

    db.query(sql, [completed, id], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                message: "Task Not Updated"
            });

        }

        res.json({
            message: "Task Updated Successfully"
        });

    });

});
app.post("/editTask", (req, res) => {

    const { id, task } = req.body;

    const sql = "UPDATE tasks SET task = ? WHERE id = ?";

    db.query(sql, [task, id], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                message: "Task Not Updated"
            });

        }

        res.json({
            message: "Task Updated Successfully"
        });

    });

});
app.post("/clearCompleted", (req, res) => {

    const { userEmail } = req.body;

    const sql = "DELETE FROM tasks WHERE user_email = ? AND completed = TRUE";

    db.query(sql, [userEmail], (err, result) => {

        if (err) {

            console.log(err);

            return res.json({
                message: "Unable to Clear Tasks"
            });

        }

        res.json({
            message: "Completed Tasks Cleared"
        });

    });

});
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI study assistant."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        res.json({
            reply: completion.choices[0].message.content
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            reply: "Sorry, AI is unavailable."
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});