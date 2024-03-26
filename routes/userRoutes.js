const express = require("express");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require("../model/User");
const Address = require("../model/Address");


const router = express.Router();

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.get('/profile', isAuth, (req, res) => {

    const sessionId = req.session.id;

    res.render('users/profile', {title: 'PROFILE'}); 

})

router.post('/profile', (req, res) => {
    req.session.destroy((error) => {
        if(error) throw error;
        res.redirect('/');
    });
})

router.get('/login', (req, res) => {
    var error = req.query.error;
    res.render('users/login', {title: 'LOGIN', error: error || null});
})

router.post('/login', async(req,res) => {
    const {userName, password} = req.body;

    if(userName === '' && password === '') {
        return res.redirect('/login?error=Empty%20fields%20u%20dumb');
    } 

    const user = await User.findOne({userName});

    if(!user) {
        return res.redirect('/login?error=Not%20a%20valid%20username');
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if(!isMatchedPassword){
        return res.redirect('/login?error=Not%20a%20valid%20password');
    }

    req.session.isAuth = true;
    req.session.userId = user._id;
    res.render('users/profile', {title: 'PROFILE'});
})

router.get('/register', (req, res) => {
    var error = req.query.error;
    res.render('users/register', {title: 'REGISTER', error: error || null});
})

router.post('/register', async(req, res) => {
    const {firstName, lastName, userName, password} = req.body;

    if(firstName == '' || lastName == '' || userName == '' || password == '') {
        return res.redirect('/register?error=Empty%20fields%20u%20dumb');
    } 

    let user = await User.findOne({userName});

    if(user) {
        return res.redirect('/register?error=User%20already%20exist!');
    }

    const hashPassword = await bcrypt.hash(password, 12);

    user = new User({
        firstName,
        lastName,
        userName,
        password: hashPassword
    });

    await user.save();

    req.session.userId = user._id;
    req.session.isAuth = true;
    res.redirect('/userAddress');
    // res.render('userAddress', {title: 'ADDRESS', error: null});
})

router.get('/userAddress', (req, res) => {
    var error = req.query.error;

    if(!req.session.isAuth) {
        res.redirect('/login');
    }
    res.render('users/userAddress', {title: 'ADDRESS', error});

});

router.post('/userAddress', async(req, res) => {
    const {line1, line2, postalCode, city, state, country} = req.body;

    if(line1 == '' || postalCode == '' || city == '' || state == '' || country == '') {
        return res.redirect('/userAddress?error=Empty%20fields%20u%20dumb');
    } 

    let userId = req.session.userId

    let address = new Address({
        userId,
        line1,
        line2,
        postalCode,
        city,
        state,
        country
    });

    await address.save();

    res.redirect('/login');
});
module.exports = router;