const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
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
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        id_number: user.id_number,
        contact: user.contact_info
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password, idNo, role, contact } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate Role (Security check)
    const allowedRoles = ['Student', 'Faculty', 'Staff', 'Admin'];
    const userRole = allowedRoles.includes(role) ? role : 'Student';

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, id_number, role, contact_info) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, idNo, userRole, contact]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Signup successful',
      token: token,
      user_id: userId,
      role: userRole,
      name: name
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Remove deprecated /register alias to clean up code
module.exports = router;
