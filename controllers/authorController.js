const asyncHandler = require("express-async-handler");
const { format } = require("morgan");
const api = require("./apiURLController");

// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
require('dotenv').config();

// Get author login form
exports.log_in_get = asyncHandler(async (req, res, next) => {
  if (localStorage.getItem('token')) {
    res.redirect('/log-out');
  } else {
    res.render("author_login", { 
      title: "Author Log-In",
    });
  }
});

// Submit author login form
exports.log_in_post = asyncHandler(async (req, res, next) => {
  const response = await fetch(api.address + 'users/login', {
    method: "POST",
    mode: "cors",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: req.body.email,
      password: req.body.password,
    })
  })
   
  // return response.json();
  // console.log(response.status);

  if (response.status == 401) {
    res.render("author_login", { 
        title: "Author Log-In",
        errorMessage: "Incorrect email / password"
      });
  }

  const loginResponse = await response.json();

  if (loginResponse.isAuthor !== true) {
    res.render("author_login", { 
      title: "Author Log-In",
      errorMessage: "You are not authorized to enter this site."
    });
  } else {
     // Save user info to localStorage
     localStorage.setItem('full_name', loginResponse.full_name);
     localStorage.setItem('isAuthor', loginResponse.isAuthor);
     localStorage.setItem('id', loginResponse.id);
     localStorage.setItem('token', loginResponse.token);
     res.redirect('/');
  }
});

exports.log_out = asyncHandler(async (req, res, next) => {
  localStorage.clear();
  res.redirect('/');
});

// Get new author sign-up form
exports.sign_up_get = asyncHandler(async (req, res, next) => {
  
  if (localStorage.getItem('token')) {
    res.redirect('/');
  } else {
    res.render('author_create', { 
      title: 'Sign-Up Form' 
    });
  }
});

// Submit new reader format, POST new reader
exports.sign_up_post = asyncHandler(async (req, res, next) => {
  const response = await fetch(api.address + 'users/', {
    method: "POST",
    mode: "cors",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    })
  })
  const signupResponse = await response.json();
  // console.log(signupResponse);
  if (Array.isArray(signupResponse)) {
    res.render('author_create', { 
        title: 'Sign-Up Form',
        errors: signupResponse,
        authorDetail: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
        }
      });
  } else {
    res.redirect('/log-in');
  }
});
