const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const productSchema = new Schema({
    make: {
        type: String,
        required : true
    },
    prodName: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    image: {
        type: String,      
    },
    price: {
        type: Number,
        required : true
    },
    quantity: {
        type: Number,
        required : true
    },
    category: {
        type: String,
        required : true
    }
}, {timestamps : true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;