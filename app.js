const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongodbSession = require('connect-mongodb-session')(session);
const Product = require("./model/Product");
require('dotenv').config();

const User = require("./model/User");

const userRoutes = require('./routes/userRoutes');
const mongooseDouble = require("mongoose-double");
const app = express();
const PORT = process.env.PORT || 3000;

const DBURI = 'mongodb+srv://netninja:test1234@nodetuts.zm7ovaq.mongodb.net/noise_shop?retryWrites=true&w=majority&appName=noise';
mongoose.connect(DBURI)
    .then((result)=> app.listen(PORT, () => console.log('server started on ' + PORT)))
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

const isAuthAdmin = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    } else {
        res.redirect('/admin-login');
    }
}

app.use(
    session({
        secret: 'Random key to session',
        resave: false,
        saveUninitialized: false,
        store
}))

////////////////////////////////////// Admin

app.get('/admin-products-list', isAuthAdmin, (req, res) => {
    Product.find()
    .then((result) => res.render('admin-products-list', {title: 'LIST OF PRODUCTS', products: result, error: null }))
    .catch((error) => console.log(error));
})

app.delete('/admin-products-list/:id', (req, res) => {
    const id = req.params.id;

    Product.findByIdAndDelete(id)
    .then((rs) => {
        res.json({redirect: '/admin-products-list'});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/admin-login', (req, res) => {
    var error = req.query.error;
    res.render('admin-login', {title: 'LOGIN', error: error || null});
})

app.post('/admin-login', async(req,res) => {
    const {userName, password, error} = req.body;

    const root = "root";

    const user = await User.findOne({userName: root});
    
    if(userName == '' && password == '') {
        return res.redirect('/admin-login?error=Empty%20fileds');
    }

    if(userName != user.userName) {
        return res.redirect('/admin-login?error=Not%20a%20valid%20user');
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if(!isMatchedPassword){
        return res.redirect('/admin-login?error=Not%20a%20valid%20password');
    }

    req.session.isAuth = true;
    res.render('products', {title: 'ADD PRODUCTS', error: null});
})

app.get('/products', isAuthAdmin ,(req, res) => {
    res.render('products', {title: 'PRODUCTS',  error: null});
})

app.post('/products', (req, res) => {
    const product = new Product(req.body);
    const { make, prodName } = req.body;

    const makeLowerCase = make.toLowerCase();
    const prodNameLowerCase = prodName.toLowerCase();

    if(product.price <= 0) {
        return res.render('products', {title: 'PRODUCTS', error: "Price can't be negative or 0"});
    }

    if(product.image == '') {
        product.image = 'https://cdn.pixabay.com/photo/2017/01/18/18/22/headphone-1990516_640.png'
    }

    Product.findOne({ make: makeLowerCase, prodName:prodNameLowerCase })
    .then(existProduct => {
        if (!existProduct) {
            return product.save();
        } else {
            return res.render('products', { title: 'PRODUCTS', error: "Product Already Exists!" });        
        }
    })
    .then(result => {
        res.redirect('/admin-products-list');
    })
    .catch(error => {
        res.render('products', { title: 'PRODUCTS', error });
    });  
})

app.get('/update-products/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);

    Product.findById(id)
            .then((result) => res.render('updateProduct', {title: 'UPDATE', value: result, error: null}))
            .catch((error) => console.log(error));
})

app.post('/update-products', isAuthAdmin,(req, res) => {
    const { id, make, prodName, description, price, quantity, category, image } = req.body;

    // console.log(id + " " + make + " " + price);

    if(price <= 0) {
        return Product.findById(id)
        .then((result) => res.render('updateProduct', {title: 'UPDATE', value: result, error: "Price can't be negative or 0"}))
        .catch((error) => console.log(error));
    }

    const imageUrl = image || 'https://cdn.pixabay.com/photo/2017/01/18/18/22/headphone-1990516_640.png';    

    const update = {
        make,
        prodName,
        description,
        price,
        quantity,
        category,
        image: imageUrl
    };

    // console.log(update);

    Product.findByIdAndUpdate(id, update, { new: true }) 
    .then(result => {
        res.redirect('/admin-products-list');
    })
    .catch(error => {
        res.render('updateProduct', { title: 'UPDATE', value: null, error });
    });
})

///////////////////////////////////////

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

app.use(userRoutes);

///////////////////////////////////

app.get('/', (req, res) => {
    
    Product.find()
        .then((result) => res.render('index', {title: 'HOME', products: result }))
        .catch((error) => console.log(error));

})