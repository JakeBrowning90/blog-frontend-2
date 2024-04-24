const asyncHandler = require("express-async-handler");
// const { post } = require("../routes");

exports.post_create_get = asyncHandler(async (req, res, next) => {
    if (localStorage.getItem('token')) {
        res.render('post_create', { 
            title: 'Post Form' 
          });
      } else {
        res.redirect('/');
      }
});

exports.post_create_post = asyncHandler(async (req, res, next) => {
    if (req.body.published == 'on') {
        req.body.published = true
    } else {
        req.body.published = false
    }

    const response = await fetch('http://localhost:3000/posts/', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
        body: JSON.stringify({ 
            title: req.body.title,
            subtitle: req.body.subtitle,
            body: req.body.body,
            user: localStorage.getItem('id'), 
            is_published: req.body.published,
        })
      })

    if (response.status == 403) {
        res.render("forbidden", {
            title: "Page Forbidden",
            message: "Your validation has expired. Please log again.",
        });
    }
    
    res.redirect(`/`);
    
});

exports.post_read = asyncHandler(async (req, res, next) => {
    const postResponse = await fetch(`http://localhost:3000/posts/${req.params.id}`, {mode: 'cors'});
    const post = await postResponse.json();
    const commentsResponse = await fetch(`http://localhost:3000/posts/${req.params.id}/comments`, {mode: 'cors'});
    const comments= await commentsResponse.json();
    res.render("post_read", { 
        title: post.title,
        post: post, 
        comments: comments
    });
});

exports.post_read_add_comment = asyncHandler(async (req, res, next) => {
    const response = await fetch('http://localhost:3000/comments/', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
        body: JSON.stringify({ 
            body: req.body.commentBody,
            reader: localStorage.getItem('id'), 
            post: req.params.id
            // is_admin: false
        })
      })

    if (response.status == 403) {
        localStorage.clear();
        res.render("reader_login", { 
            title: "Reader Log-In",
            errorMessage: "Your validation has expired, please log in again."
        });
    }

    res.redirect(`/posts/${req.params.id}`);
});