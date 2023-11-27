const express = require('express');
const router = express.Router();

router.get('/view', (req, res) => {
  res.render('viewReport');
});

router.get('/create', (req, res) => {
  res.render('createReport');
});

module.exports = router;