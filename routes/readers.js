const express = require('express');
const router = express.Router();

const readerController = require("../controllers/readerController");

// Reader Login (YES)
router.get("/log-in", readerController.log_in_get);

router.post("/log-in", readerController.log_in_post);

router.get("/log-out", readerController.log_out);

// Create reader (YES)
router.get('/sign-up', readerController.sign_up_get);
  
router.post('/sign-up', readerController.sign_up_post);

// Read ALL reader

// Read reader

// Update reader

// Delete reader

module.exports = router;