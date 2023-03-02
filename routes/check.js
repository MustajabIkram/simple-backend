const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  return res.status(200).json({
    title: 'Check Route',
    message: 'The check is working properly!',
  });
});

module.exports = router;
