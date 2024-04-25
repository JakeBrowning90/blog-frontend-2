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
router.get("/:id/edit", postController.post_edit_get);

router.post("/:id/edit", postController.post_edit_post);

// Delete post (YES)
router.get("/:id/delete", postController.post_delete_get);

router.post("/:id/delete", postController.post_delete_post);


module.exports = router;