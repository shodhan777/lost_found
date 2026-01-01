const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const auth = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Helper function for keyword matching
const buildMatchQuery = (table, text) => {
  const keywords = text.split(/\s+/).filter(w => w.length > 2); // Ignore short words
  if (keywords.length === 0) return { query: `SELECT * FROM ${table} WHERE 1=0`, params: [] };

  const conditions = keywords.map(() => `(title LIKE ? OR description LIKE ?)`).join(' OR ');
  const params = keywords.flatMap(k => [`%${k}%`, `%${k}%`]);

  return { query: `SELECT * FROM ${table} WHERE ${conditions}`, params };
};

// PROTECTED ROUTE: Report Found Item
router.post('/found', auth, upload.single('image'), async (req, res) => {
  const { title, description, location, date_found } = req.body;
  const user_id = req.user.id; // Securely get ID from token
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO found_items (user_id, title, description, location, date_found, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, title, description, location, date_found, image_url]
    );

    const foundItemId = result.insertId;

    // --- SMART MATCHING: LOST ITEMS ---
    const { query, params } = buildMatchQuery('lost_items', title + ' ' + description);
    const [matchedLostItems] = await pool.query(query, params);
    // ----------------------------------

    const matches = [];

    for (let lostItem of matchedLostItems) {
      const [matchInsert] = await pool.query(
        `INSERT INTO matches (lost_item_id, found_item_id, status, matched_on, lost_image, found_image)
         VALUES (?, ?, 'matched', NOW(), ?, ?)`,
        [lostItem.id, foundItemId, lostItem.image_url, image_url]
      );

      matches.push({
        match_id: matchInsert.insertId,
        lost_item_id: lostItem.id,
        lost_title: lostItem.title,
        lost_description: lostItem.description,
        lost_location: lostItem.location,
        lost_image: lostItem.image_url,

        found_item_id: foundItemId,
        found_title: title,
        found_description: description,
        found_location: location,
        found_image: image_url,
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


// PROTECTED ROUTE: Report Lost Item
router.post('/lost', auth, upload.single('image'), async (req, res) => {
  const { title, description, location, date_lost } = req.body;
  const user_id = req.user.id; // Securely get ID from token
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO lost_items (user_id, title, description, location, date_lost, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, title, description, location, date_lost, image_url]
    );

    const lostItemId = result.insertId;

    // --- SMART MATCHING: FOUND ITEMS ---
    const { query, params } = buildMatchQuery('found_items', title + ' ' + description);
    const [matchedFoundItems] = await pool.query(query, params);
    // -----------------------------------

    const matches = [];

    for (let foundItem of matchedFoundItems) {
      const [matchInsert] = await pool.query(
        `INSERT INTO matches (lost_item_id, found_item_id, status, matched_on, lost_image, found_image)
         VALUES (?, ?, 'matched', NOW(), ?, ?)`,
        [lostItemId, foundItem.id, image_url, foundItem.image_url]
      );

      matches.push({
        match_id: matchInsert.insertId,
        lost_item_id: lostItemId,
        lost_title: title,
        lost_description: description,
        lost_location: location,
        lost_image: image_url,

        found_item_id: foundItem.id,
        found_title: foundItem.title,
        found_description: foundItem.description,
        found_location: foundItem.location,
        found_image: foundItem.image_url,
      });
    }

    res.status(201).json({
      message: 'Lost item submitted successfully',
      id: lostItemId,
      matches: matches // Return matches if any
    });
  } catch (err) {
    console.error('Error inserting lost item or matching:', err);
    res.status(500).json({ error: 'Error inserting lost item or matching' });
  }
});


router.get('/matches', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        matches.id AS match_id,
        lost_items.title AS lost_title,
        lost_items.description AS lost_description,
        lost_items.location AS lost_location,
        lost_items.image_url AS lost_image,       

        found_items.title AS found_title,
        found_items.description AS found_description,
        found_items.location AS found_location,
        found_items.image_url AS found_image,     

        matches.status,
        matches.claim_status,
        matches.matched_on,
        users.email AS user_email
      FROM matches
      JOIN lost_items ON lost_items.id = matches.lost_item_id
      JOIN found_items ON found_items.id = matches.found_item_id
      JOIN users ON users.id = found_items.user_id
      WHERE matches.status = 'matched' AND matches.claim_status = 'unclaimed';
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

const sendEmail = require('../utils/emailService');

// Claim match route
router.patch('/match/:id/claim', auth, async (req, res) => {
  const matchId = req.params.id;

  try {
    // 1. Mark as claimed
    const [result] = await pool.query(
      'UPDATE matches SET status = ?, claim_status = ? WHERE id = ?',
      ['claimed', 'claimed', matchId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // 2. Fetch details to send email
    const [matchDetails] = await pool.query(`
      SELECT 
        u.email AS finder_email, 
        f.title AS item_title 
      FROM matches m
      JOIN found_items f ON m.found_item_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE m.id = ?
    `, [matchId]);

    // 3. Send Notification if user exists
    if (matchDetails.length > 0) {
      const { finder_email, item_title } = matchDetails[0];
      await sendEmail(
        finder_email,
        'Item Claimed!',
        `Great news! The item "${item_title}" has been successfully claimed by the owner. Please coordinate the return.`
      );
    }

    res.json({ message: 'Match marked as claimed and owner notified' });
  } catch (err) {
    console.error('Error updating match status:', err);
    res.status(500).json({ error: 'Failed to update match status' });
  }
});

// Get recent items (both lost and found)
router.get('/recent', async (req, res) => {
  try {
    const [lostItems] = await pool.query('SELECT *, "lost" as type FROM lost_items ORDER BY date_lost DESC LIMIT 3');
    const [foundItems] = await pool.query('SELECT *, "found" as type FROM found_items ORDER BY date_found DESC LIMIT 3');

    const recentItems = [...lostItems, ...foundItems].sort((a, b) => new Date(b.created_at || b.date_lost || b.date_found) - new Date(a.created_at || a.date_lost || a.date_found));

    res.json(recentItems);
  } catch (err) {
    console.error('Error fetching recent items:', err);
    res.status(500).json({ error: 'Failed to fetch recent items' });
  }
});

module.exports = router;
