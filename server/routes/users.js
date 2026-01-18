const express = require('express');
const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get User Profile
router.get('/:id', auth, async (req, res) => {
    try {
        // Only allow users to view their own profile or admin
        if (req.user.id != req.params.id && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const [rows] = await pool.query(
            'SELECT id, name, email, role, id_number, contact_info, profile_pic FROM users WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Profile
router.put('/:id', auth, async (req, res) => {
    const { name, contact_info } = req.body;
    try {
        if (req.user.id != req.params.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await pool.query(
            'UPDATE users SET name = ?, contact_info = ? WHERE id = ?',
            [name, contact_info, req.params.id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Activity History
router.get('/:id/history', auth, async (req, res) => {
    try {
        if (req.user.id != req.params.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const [lost] = await pool.query('SELECT *, "lost" as type FROM lost_items WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);
        const [found] = await pool.query('SELECT *, "found" as type FROM found_items WHERE user_id = ? ORDER BY created_at DESC', [req.params.id]);

        const history = [...lost, ...found].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
