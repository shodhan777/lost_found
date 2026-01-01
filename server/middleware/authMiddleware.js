const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = decoded; // Add user payload to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
