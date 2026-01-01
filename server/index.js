const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise'); // Using mysql2/promise for async/await support
const multer = require('multer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Happy@999', // Keeping user's hardcoded password if env matches
  database: process.env.DB_NAME || 'lost_and_found_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
// Note: We are passing 'pool' and 'upload' to itemRoutes as required by its new structure
const itemRoutes = require('./routes/items')(pool, upload);
const authRoutes = require('./routes/auth')(pool); // Assuming auth also needs pool
const adminRoutes = require('./routes/admin')(pool); // Passing pool to admin as well for consistency

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
