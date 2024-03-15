const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongodbSession = require('connect-mongodb-session')(session);
const Product = require("./model/Product");
const User = require("./model/User");

const app = express();
const PORT = 3000;

const DBURI = 'mongodb+srv://netninja:test1234@nodetuts.zm7ovaq.mongodb.net/noise_shop?retryWrites=true&w=majority&appName=noise';
mongoose.connect(DBURI)
    .then((result)=> app.listen(PORT, () => console.log('server started on' + PORT)))
    .catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const store = new MongodbSession({
    uri: DBURI,
    collection: "mySession"
})

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.use(
    session({
        secret: 'Random key to session',
        resave: false,
        saveUninitialized: false,
        store
}))

app.get('/products', (req, res) => {
    res.render('products', {title: 'PRODUCTS'});
})

app.post('/products', (req, res) => {
    const product = new Product(req.body);

    product.save()
        .then((result) => res.redirect('/'))
        .catch((error) => console.log(error));
})

app.get('/products/:id', (req, res) => {
    const id = req.params.id;

    Product.findById(id)
        .then((result) => res.render('cart', {title: 'CART', product: result}))
        .catch((error) => console.log(error));
})

app.get('/cart', (req, res) => {
    res.render('cart', {title: 'CART', product: null});
})

/////////////////////////////////// USER

app.get('/profile', isAuth, (req, res) => {
    res.render('users/profile', {title: 'PROFILE'});
})

app.post('/profile', (req, res) => {
    req.session.destroy((error) => {
        if(error) throw error;
        res.redirect('/login');
    });
})

app.get('/login', (req, res) => {
    res.render('users/login', {title: 'LOGIN'});
})

app.post('/login', async(req,res) => {
    const {userName, password} = req.body;

    const user = await User.findOne({userName});

    if(!user) {
        return res.redirect('/login');
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if(!isMatchedPassword){
        return res.redirect('/login');
    }

    req.session.isAuth = true;
    res.redirect('/profile');
})

app.get('/register', (req, res) => {
    res.render('users/register', {title: 'REGISTER'});
})

app.post('/register', async(req, res) => {
    const {firstName, lastName, userName, password} = req.body;

    let user = await User.findOne({userName});

    if(user) {
        return res.redirect('/register');
    }

    const hashPassword = await bcrypt.hash(password, 12);

    user = new User({
        firstName,
        lastName,
        userName,
        password: hashPassword
    });

    await user.save();

    res.redirect('/login');
})

///////////////////////////////////

app.get('/', (req, res) => {
    
    Product.find()
        .then((result) => res.render('index', {title: 'HOME', products: result }))
        .catch((error) => console.log(error));

})