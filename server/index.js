const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from /upload directory
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'shodhan@777',
  database: 'hi',
});

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
// Importing routes
const itemRoutes = require('./routes/items')(pool, upload);
app.use('/api/items', itemRoutes);

const authRoutes = require('./routes/auth')(pool);
app.use('/api/auth', authRoutes);

// Start server
app.listen(5000, () => {
  console.log('✅ Server running on port 5000');
});
