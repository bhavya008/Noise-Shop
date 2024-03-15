const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Product = require("./model/Product");

const app = express();
const PORT = 3000;

const DBURI = 'mongodb+srv://netninja:test1234@nodetuts.zm7ovaq.mongodb.net/noise_shop?retryWrites=true&w=majority&appName=noise';
mongoose.connect(DBURI)
    .then((result)=> app.listen(PORT, () => console.log('server started on ' + PORT)))
    .catch((error) => console.log(error));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

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

app.get('/', (req, res) => {
    
    Product.find()
        .then((result) => res.render('index', {title: 'HOME', products: result }))
        .catch((error) => console.log(error));

})