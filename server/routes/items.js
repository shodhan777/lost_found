const express = require('express');

module.exports = (pool) => {
  const router = express.Router();


  router.post('/found', async (req, res) => {
    const { title, description, location, date_found, image_url, user_id } = req.body;
  
    try {
      
      const [result] = await pool.query(
        'INSERT INTO found_items (user_id, title, description, location, date_found, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, title, description, location, date_found, image_url]
      );
  
      const foundItemId = result.insertId;
  
     
      const [matchedLostItems] = await pool.query(
        `SELECT * FROM lost_items
         WHERE title LIKE ? OR location LIKE ?`,
        [`%${title}%`, `%${location}%`]
      );
  
      const matches = [];
  
      
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
          lost_image_url: lostItem.image_url,  
          found_item_id: foundItemId,
          found_image_url: image_url,         
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
  

  router.post('/lost', async (req, res) => {
    const { title, description, location, date_lost, image_url } = req.body;

    try {
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



  
  router.patch('/match/:id/claim', async (req, res) => {
    const matchId = req.params.id;

    try {
      const [result] = await pool.query(
        'UPDATE matches SET status = ? WHERE id = ?',
        ['claimed', matchId]
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
