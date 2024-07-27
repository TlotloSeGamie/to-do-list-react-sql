const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo_database'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
  connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);
  connection.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      description TEXT NOT NULL,
      priority ENUM('low', 'medium', 'high') NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
    if (err) {
      res.status(500).send('Registration failed');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0 || !await bcrypt.compare(password, results[0].password)) {
      res.status(401).send('Invalid username or password');
    } else {
      res.status(200).json({ user: results[0] });
    }
  });
});

app.get('/tasks/:userId', (req, res) => {
  const userId = req.params.userId;
  connection.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).send('Failed to fetch tasks');
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/tasks', (req, res) => {
  const { user_id, description, priority } = req.body;
  connection.query('INSERT INTO tasks (user_id, description, priority) VALUES (?, ?, ?)', [user_id, description, priority], (err, results) => {
    if (err) {
      res.status(500).send('Failed to add task');
    } else {
      res.status(200).json({ id: results.insertId });
    }
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).send('Failed to delete task');
    } else {
      res.status(200).send('Task deleted successfully');
    }
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { description, priority } = req.body;
  connection.query('UPDATE tasks SET description = ?, priority = ? WHERE id = ?', [description, priority, id], (err) => {
    if (err) {
      res.status(500).send('Failed to update task');
    } else {
      res.status(200).send('Task updated successfully');
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});