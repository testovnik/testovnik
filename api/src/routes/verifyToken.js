const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ['HS256'],
    });
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};
