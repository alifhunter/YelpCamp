const express = require('express');
const router = express.Router();
const passport = require('passport');
const Comment = require('../models/user');

// ROUTES // 
// root route
router.get("/", (req,res) =>{
    res.render("landing");
});

// ==========
// AUTH ROUTE
// ==========

// show registration form
router.get('/register', (req,res) => {
    res.render('register');
});

// handle registration logic
router.post('/register', (req,res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('/register');
        }
        passport.authenticate("local")(req, res, () => { // local strategy
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// handle login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {

});

// handle logout
router.get('/logout', (req,res) =>{
    req.logOut();
    res.redirect('/campgrounds');
});

// is logged in?
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;