const express = require('express');
const router = express.Router();
const User = require('../user.js');
const wrapAsync = require("../../utile/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../../views/users/middleware.js");
const userController = require('../routes\/controllers/users.js');



router.route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));    

router.route('/login')
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
     passport.authenticate('local', 
    { failureRedirect: '/login', 
    failureFlash: true }), 
     
    (req, res) => {
       req.flash('success', 'Welcome back!');
       res.redirect("/listings");
    }
    );


router.get('/logout', userController.logout);

module.exports = router;