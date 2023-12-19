const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/weads/home");
});

module.exports = router;