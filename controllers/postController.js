const asyncHandler = require("express-async-handler");
const api = require("./apiURLController");

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

    const response = await fetch(api.address + 'posts/', {
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
    if (localStorage.getItem('token')) {
        const postResponse = await fetch(api.address + `posts/${req.params.id}`, {mode: 'cors'});
        const post = await postResponse.json();
        const commentsResponse = await fetch(api.address + `posts/${req.params.id}/comments`, {mode: 'cors'});
        const comments= await commentsResponse.json();
        res.render("post_read", { 
            title: post.title,
            post: post, 
            comments: comments
        });
      } else {
        res.redirect('/');
      }
});

exports.post_read_add_comment = asyncHandler(async (req, res, next) => {
    const response = await fetch(api.address + 'comments/', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
        body: JSON.stringify({ 
            body: req.body.commentBody,
            user: localStorage.getItem('id'), 
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

exports.post_edit_get = asyncHandler(async (req, res, next) => {
    const postResponse = await fetch(api.address + `posts/${req.params.id}`, {mode: 'cors'});
    const post = await postResponse.json();
    if (localStorage.getItem('token')) {
        res.render('post_create', { 
            title: 'Post Form', 
            postDetail: post
          });
      } else {
        res.redirect('/');
      }
});

exports.post_edit_post = asyncHandler(async (req, res, next) => {
    if (req.body.published == 'on') {
        req.body.published = true
    } else {
        req.body.published = false
    }

    const response = await fetch(api.address + `posts/${req.params.id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
        body: JSON.stringify({ 
            title: req.body.title,
            subtitle: req.body.subtitle,
            body: req.body.body,
            timestamp: req.body.timestamp,
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

exports.post_delete_get = asyncHandler(async (req, res, next) => {

    if (localStorage.getItem('token')) {
        const postResponse = await fetch(api.address + `posts/${req.params.id}`, {
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "authorization":  localStorage.getItem('token'),
            },
        });
        if (postResponse.status == 403) {
            res.render("forbidden", {
                title: "Page Forbidden",
            });
        }
        const post = await postResponse.json();
        if (post == null) {
            res.redirect('/')
        } else {
            res.render('post_delete', {
                title: 'Delete this post and all its comments?',
                post: post
            });
        }
      } else {
        res.redirect('/');
      }

});

exports.post_delete_post = asyncHandler(async (req, res, next) => {

    const deleteCommentsResponse = await fetch(api.address + `posts/${req.params.id}/comments`, {
        mode: 'cors', 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
    });

    const deleteResponse = await fetch(api.address + `posts/${req.params.id}`, {
        mode: 'cors', 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
    });
    if (deleteResponse.status == 403) {
        res.render("forbidden", {
            title: "Page Forbidden",
        });
    }
    const deleteMessage = await deleteResponse.json();
    res.redirect('/')
});