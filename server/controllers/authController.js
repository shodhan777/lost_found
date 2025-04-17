module.exports = (pool) => ({
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.json({ message: 'Login successful', user: rows[0] });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
});
