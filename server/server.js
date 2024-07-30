require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const secretKey = process.env.SECRET_KEY;

const db = new Database('database.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, hashedPassword);
    res.status(200).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Registration failed');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?'); 
    const user = stmt.get(email);
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ user });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    res.status(500).send('Login failed');
  }
});

app.get('/tasks/:userId', (req, res) => {
  const userId = req.params.userId;
  try {
    const stmt = db.prepare('SELECT * FROM tasks WHERE user_id = ?');
    const tasks = stmt.all(userId);
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

app.post('/tasks', (req, res) => {
  const { user_id, description, priority } = req.body;
  console.log("Received task data:", req.body); 
  try {
    const stmt = db.prepare('INSERT INTO tasks (user_id, description, priority) VALUES (?, ?, ?)');
    const result = stmt.run(user_id, description, priority);
    res.status(200).send({ id: result.lastInsertRowid });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send('Error adding task');
  }
});

app.delete('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  try {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(taskId);
    res.status(200).send('Task deleted');
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

app.put('/tasks/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { description, priority } = req.body;
  try {
    const stmt = db.prepare('UPDATE tasks SET description = ?, priority = ? WHERE id = ?');
    stmt.run(description, priority, taskId);
    res.status(200).send('Task updated');
  } catch (err) {
    res.status(500).send('Error updating task');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});