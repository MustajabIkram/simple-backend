const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  return res.status(200).json({
    title: 'Checking ',
    message: 'This Works Well',
  });
});

module.exports = router;
