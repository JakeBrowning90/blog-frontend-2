const asyncHandler = require("express-async-handler");
const api = require("./apiURLController");

exports.comment_read = asyncHandler(async (req, res, next) => {
    const commentResponse = await fetch(api.address + `comments/${req.params.id}`, {
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "authorization":  localStorage.getItem('token'),
        },
    });

    if (commentResponse.status == 403) {
        res.render("forbidden", {
            title: "Page Forbidden",
        });
    }

    const comment = await commentResponse.json();

    if (comment == null) {
        res.redirect('/')
    } else {
        res.render('comment_detail', {
            title: 'Delete this comment?',
            comment: comment
        });
    }
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
    const deleteResponse = await fetch(api.address + `comments/${req.params.id}`, {
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
    // console.log(deleteMessage)
    res.redirect('/')
});
