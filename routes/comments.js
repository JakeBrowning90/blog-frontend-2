const express = require('express');
const router = express.Router();

const commentController = require("../controllers/commentController");

router.get("/:id", commentController.comment_read);

router.post("/:id", commentController.comment_delete);

// Create comment (YES)

// Read ALL comments

// Read comment

// Update comment (YES)

// Delete comment (YES)

module.exports = router;