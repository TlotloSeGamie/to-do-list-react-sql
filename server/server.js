const express = require('express');
const cors = require('cors');
const betterSqlite3 = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const db = betterSqlite3('database.db');
const secretKey = 'your_secret_key';

app.use(cors());
app.use(express.json());

// Create the Tables if they don't exist
const createTables = () => {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;
  db.prepare(userTable).run();

  const taskTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      priority TEXT CHECK( priority IN ('low','medium','high') ) NOT NULL DEFAULT 'low',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
  db.prepare(taskTable).run();
};

createTables();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User Registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password should be at least 8 characters long' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `;
    const info = db.prepare(sql).run(username, email, hashedPassword);
    res.status(201).json({ message: 'User registered successfully', id: info.lastInsertRowid });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, secretKey);
  res.json({ token });
});

// Add a new task
app.post('/tasks', authenticateToken, (req, res) => {
  const { description, priority } = req.body;
  const user_id = req.user.id;

  if (!description || !priority) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO tasks (user_id, description, priority)
    VALUES (?, ?, ?)
  `;
  const info = db.prepare(sql).run(user_id, description, priority);
  res.status(201).json({ id: info.lastInsertRowid });
});

// Get tasks for a user
app.get('/tasks', authenticateToken, (req, res) => {
  const user_id = req.user.id;
  const sql = `
    SELECT * FROM tasks
    WHERE user_id = ?
  `;
  const tasks = db.prepare(sql).all(user_id);
  res.json(tasks);
});

// Update a task
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { description, priority } = req.body;
  const user_id = req.user.id;

  const sql = `
    UPDATE tasks
    SET description = ?, priority = ?
    WHERE id = ? AND user_id = ?
  `;
  const info = db.prepare(sql).run(description, priority, id, user_id);
  if (info.changes > 0) {
    res.json({ message: 'Task updated successfully' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const sql = `
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `;
  const info = db.prepare(sql).run(id, user_id);
  if (info.changes > 0) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});