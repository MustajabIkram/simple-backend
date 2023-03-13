const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const user = ['Test123!'];

router.post('/', async (req, res, next) => {
  const password = req.body.password;
  res.send({
    isUser: user.includes(password),
    hash: uuidv4(),
  });
});

module.exports = router;
