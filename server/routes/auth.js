const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: `user-${user.id}`, // TODO: Replace with real JWT later
      user_id: user.id,
      role: user.role
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Signup successful',
      token: `user-${result.insertId}`,
      user_id: result.insertId,
      role: 'user'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Alias for signup if needed, or remove if redundant. Keeping for compatibility.
router.post('/register', async (req, res) => {
  // Redirect to signup logic or duplicate
  // For now, let's just reuse the signup logic to avoid code duplication
  // In a real app, we'd just have one route.
  const { username, email, password } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );

    res.status(201).json({
      message: 'Signup successful',
      token: `user-${result.insertId}`,
      user_id: result.insertId,
      role: 'user'
    });
  } catch (err) {
    console.error('Signup error (register):', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

module.exports = router;
