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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    cb(null, 'uploads/');
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

app.post('/uploads', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const image_url = `http://localhost:5000/uploads/${req.file.filename}`;
  console.log("Generated image_url:", image_url);

  res.json({
    imageUrl: image_url,
  });
});


app.use('/uploads', express.static('uploads'));

// Start server
app.listen(5000, () => {
  console.log('✅ Server running on port 5000');
});
