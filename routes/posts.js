const express = require('express');
const router = express.Router();

const postController = require("../controllers/postController");

// Create post (YES)
router.get("/new", postController.post_create_get);

router.post("/new", postController.post_create_post);

// Read ALL posts (truncate in Index?)

// Read post (YES)
// router.get("/posts/:id", postController.post_read);
router.get("/:id", postController.post_read);

router.post("/:id", postController.post_read_add_comment);

// Update post (YES)

// Delete post (YES)

module.exports = router;