const router = require('express').Router();

const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: 'my first test',
      description: 'random data you shouldnt access',
    },
  });
});

module.exports = router;
