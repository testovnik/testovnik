const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validate');

router.post('/register', async (req, res) => {
  const { error, value } = registerValidation(req.body);

  if (error)
    return res.status(400).send(error.details.map((detail) => detail.message));

  // Check if the email already exists
  const emailExists = await User.findOne({ email: value.email });
  if (emailExists) return res.status(400).send('Email already exists');

  // Check if the username is taken
  const usernameExists = await User.findOne({ name: value.username });
  if (usernameExists) return res.status(400).send('Username already exists');

  // Hash the password and append the salt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);
  const preparedUser = { ...value, password: hashedPassword };

  const user = new User(preparedUser);

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { error, value } = loginValidation(req.body);

  if (error)
    return res.status(400).send(error.details.map((detail) => detail.message));

  // Check if the email already exists
  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(400).send('Invalid email');

  // Check if the password is correct
  const validPass = await bcrypt.compare(value.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  // create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
