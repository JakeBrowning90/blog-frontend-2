var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  const response = await fetch("http://localhost:3000/posts", {mode: 'cors'});
  const postList= await response.json();
  // console.log(postList);
  res.render('index', { title: "Authors' Dashboard", postList: postList});
});

module.exports = router;
