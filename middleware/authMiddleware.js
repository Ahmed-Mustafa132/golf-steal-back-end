const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.secret);
    const user = await User.findOne({ _id: decoded.data.id, role: 'Admin' });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as an admin.' });
  }
};

module.exports = { isAdmin };
