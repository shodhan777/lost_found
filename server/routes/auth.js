const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Login Route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? AND password = ?', 
        [email, password]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = rows[0];
      res.json({
        message: 'Login successful',
        token: `user-${user.id}`,
        user_id: user.id
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error during login' });
    }
  });

  // Signup Route
  router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const [existing] = await pool.query(
        'SELECT * FROM users WHERE email = ?', 
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );

      res.status(201).json({
        message: 'Signup successful',
        token: `user-${result.insertId}`,
        user_id: result.insertId
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Server error during signup' });
    }
  });

  // Optional: /register alias (for compatibility with some frontend)
  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const [result] = await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );

      res.status(201).json({
        message: 'Signup successful',
        token: `user-${result.insertId}`,
        user_id: result.insertId
      });
    } catch (err) {
      console.error('Signup error (register):', err);
      res.status(500).json({ error: 'Server error during registration' });
    }
  });

  return router;
};
