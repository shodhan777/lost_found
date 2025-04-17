const Item = require('../models/Item');

exports.reportItem = (req, res) => {
  const item = { ...req.body, userId: req.user.id };
  Item.reportItem(item, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ msg: "Item reported" });
  });
};
