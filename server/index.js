const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MySQL pool connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'shodhan@777', // ⚠️ Replace with env variable in production
  database: 'hi'            // Your database name
});

// Routes
const itemRoutes = require('./routes/items')(pool);
app.use('/api/items', itemRoutes);

const authRoutes = require('./routes/auth')(pool);
app.use('/api/auth', authRoutes);

// Start server
app.listen(5000, () => {
  console.log('✅ Server running on port 5000');
});
