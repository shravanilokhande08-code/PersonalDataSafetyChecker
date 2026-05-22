const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ===== REGISTER =====
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.query("INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
            if (err) return res.send(err);
            res.send("User Registered");
        });
});

// ===== LOGIN =====
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username=? AND password=?",
        [username, password],
        (err, result) => {
            if (err) return res.send(err);

            if (result.length > 0)
                res.send("Success");
            else
                res.send("Fail");
        });
});

// ===== CREATE TASK =====
app.post("/add-task", (req, res) => {
    const { username, task } = req.body;

    db.query("INSERT INTO tasks (username, task) VALUES (?, ?)",
        [username, task],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Task Added");
        });
});

// ===== READ TASKS =====
app.get("/tasks/:username", (req, res) => {
    const username = req.params.username;

    db.query("SELECT * FROM tasks WHERE username=?",
        [username],
        (err, result) => {
            if (err) return res.send(err);
            res.json(result);
        });
});

// ===== DELETE TASK =====
app.delete("/delete-task/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM tasks WHERE id=?",
        [id],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Deleted");
        });
});

// ===== UPDATE TASK =====
app.put("/update-task/:id", (req, res) => {
    const id = req.params.id;
    const { task } = req.body;

    db.query("UPDATE tasks SET task=? WHERE id=?", [task, id],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Updated");
        });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});