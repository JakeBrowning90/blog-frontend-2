// const Reader = require('../models/reader');
const asyncHandler = require("express-async-handler");
const { format } = require("morgan");
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");

require('dotenv').config();

// Get reader login form
exports.log_in_get = asyncHandler(async (req, res, next) => {
  if (localStorage.getItem('token')) {
    res.redirect('/');
  } else {
    res.render("reader_login", { 
      title: "Reader Log-In",
    });
  }
});

// Submit reader login form
exports.log_in_post = asyncHandler(async (req, res, next) => {
  const response = await fetch('http://localhost:3000/readers/login', {
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
    res.render("reader_login", { 
      title: "Reader Log-In",
      errorMessage: "Incorrect email / password"
    });
  } else {
    const loginResponse = await response.json();
    // Save user info to localStorage
    localStorage.setItem('full_name', loginResponse.full_name);
    localStorage.setItem('id', loginResponse.id);
    localStorage.setItem('token', loginResponse.token);
    res.redirect('/');
  }
});

exports.log_out = asyncHandler(async (req, res, next) => {
  localStorage.clear();
  res.redirect('/');
});

// Get new reader sign-up form
exports.sign_up_get = asyncHandler(async (req, res, next) => {
  
  if (localStorage.getItem('token')) {
    res.redirect('/');
  } else {
    res.render('reader_create', { 
      title: 'Sign-Up Form' 
    });
  }
});

// Submit new reader format, POST new reader
exports.sign_up_post = asyncHandler(async (req, res, next) => {
  const response = await fetch('http://localhost:3000/readers/', {
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
    // is_admin: false
    })
  })
  const signupResponse = await response.json();
  // console.log(signupResponse);
  if (Array.isArray(signupResponse)) {
    res.render('reader_create', { 
      title: 'Sign-Up Form',
      errors: signupResponse,
      readerDetail: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      }
    });
  } else {
    res.redirect('/readers/log-in');
  }
});
