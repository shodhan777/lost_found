const express = require('express');
const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as the filename
  }
});

const upload = multer({ storage: storage });

module.exports = (pool) => {
  const router = express.Router();

  // Found Item route with image upload
  router.post('/found', upload.single('image'), async (req, res) => {
    const { title, description, location, date_found, user_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null; // Image URL based on file name

    try {
      // Insert the found item

      console.log("Inserting data with image_url:", image_url);

      const [result] = await pool.query(
        'INSERT INTO found_items (user_id, title, description, location, date_found, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description, location, date_found, image_url]
      );

      const foundItemId = result.insertId;

      // Match with lost items based on title or location
      const [matchedLostItems] = await pool.query(
        `SELECT * FROM lost_items
   WHERE title LIKE ?`,
  [`%${title}%`],
        [`%${title}%`]
      );

      const matches = [];

      // Insert match information for each matched lost item
      for (let lostItem of matchedLostItems) {
        const [matchInsert] = await pool.query(
          `INSERT INTO matches (lost_item_id, found_item_id, status, matched_on)
           VALUES (?, ?, 'matched', NOW())`,
          [lostItem.id, foundItemId]
        );

        matches.push({
          match_id: matchInsert.insertId,
          lost_title: lostItem.title,
          lost_description: lostItem.description,
          lost_location: lostItem.location,
          lost_image_url: lostItem.image_url,  // Lost item image URL
          found_item_id: foundItemId,
          found_image_url: image_url,         // Found item image URL
        });
      }

      res.status(201).json({
        message: 'Found item reported successfully',
        matches: matches  
      });

    } catch (err) {
      console.error('Error reporting found item or matching lost items:', err);
      res.status(500).json({ error: 'Error inserting found item or matching lost items' });
    }
  });

  // Lost Item route with image upload
  router.post('/lost', upload.single('image'), async (req, res) => {
    const { title, description, location, date_lost } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null; // Image URL based on file name

    try {
      // Insert the lost item
      const [result] = await pool.query(
        'INSERT INTO lost_items (title, description, location, date_lost, image_url) VALUES (?, ?, ?, ?, ?)',
        [title, description, location, date_lost, image_url]
      );

      res.status(201).json({ message: 'Lost item submitted successfully', id: result.insertId });
    } catch (err) {
      console.error('Error inserting lost item:', err);
      res.status(500).json({ error: 'Error inserting lost item' });
    }
  });

  // Fetch matches route
  router.get('/matches', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
          matches.id AS match_id,
          lost_items.title AS lost_title,
          lost_items.description AS lost_description,
          lost_items.location AS lost_location,
          found_items.title AS found_title,
          found_items.description AS found_description,
          found_items.location AS found_location,
          matches.status,
          matches.claim_status,
          matches.matched_on,
          users.email AS user_email,
          lost_items.image_url AS lost_image_url,
          found_items.image_url AS found_image_url
        FROM matches
        JOIN lost_items ON lost_items.id = matches.lost_item_id
        JOIN found_items ON found_items.id = matches.found_item_id
        JOIN users ON users.id = found_items.user_id
        WHERE matches.status = 'matched' AND matches.claim_status = 'unclaimed'
      `);

      res.json(rows);
    } catch (err) {
      console.error('Error fetching matches:', err);
      res.status(500).json({ error: 'Failed to fetch matches' });
    }
  });

  // Claim match route
  router.patch('/match/:id/claim', async (req, res) => {
    const matchId = req.params.id;

    try {
      const [result] = await pool.query(
        'UPDATE matches SET status = ?, claim_status = ? WHERE id = ?',
        ['claimed', 'claimed', matchId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Match not found' });
      }

      res.json({ message: 'Match marked as claimed' });
    } catch (err) {
      console.error('Error updating match status:', err);
      res.status(500).json({ error: 'Failed to update match status' });
    }
  });

  return router;
};
