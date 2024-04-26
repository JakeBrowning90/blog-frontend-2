const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController");

/* GET home page. */
router.get('/', async function(req, res, next) {
  // If no token, redirect to login
  if ((localStorage.getItem('token') == undefined) && (localStorage.getItem('isAuthor') !== "true")) {
    res.redirect('/log-in');
  } else {
    const response = await fetch("http://localhost:3000/posts/all", {mode: 'cors'});
    const postList= await response.json();
    res.render('index', { title: "Authors' Dashboard", postList: postList});
  };
});

router.get("/log-in", authorController.log_in_get);

router.post("/log-in", authorController.log_in_post);

router.get("/log-out", authorController.log_out);

router.get('/sign-up', authorController.sign_up_get);
  
router.post('/sign-up', authorController.sign_up_post);

module.exports = router;
