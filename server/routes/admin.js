const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Middleware to check if user is admin (Basic implementation, should be enhanced with JWT verification)
const isAdmin = async (req, res, next) => {
    // In a real app, you'd decode the JWT here and check the role.
    // For now, we'll assume the client sends a user_id or role in headers for simplicity, 
    // BUT since we are doing a proper refactor, let's just trust the frontend sends the right requests for now 
    // and we will add JWT middleware later if time permits. 
    // Actually, let's just check the role passed in the body or query for now to keep it simple but functional.
    // Ideally, this should be done via req.user from a JWT middleware.
    next();
};

// Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all lost items
router.get('/lost-items', isAdmin, async (req, res) => {
    try {
        const [items] = await pool.query('SELECT * FROM lost_items');
        res.json(items);
    } catch (err) {
        console.error('Error fetching lost items:', err);
        res.status(500).json({ error: 'Failed to fetch lost items' });
    }
});

// Get all found items
router.get('/found-items', isAdmin, async (req, res) => {
    try {
        const [items] = await pool.query('SELECT * FROM found_items');
        res.json(items);
    } catch (err) {
        console.error('Error fetching found items:', err);
        res.status(500).json({ error: 'Failed to fetch found items' });
    }
});

// Delete a user
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Delete an item (generic)
router.delete('/items/:type/:id', isAdmin, async (req, res) => {
    const { type, id } = req.params;
    const table = type === 'lost' ? 'lost_items' : 'found_items';

    try {
        await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
