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
        default: 'https://cdn.pixabay.com/photo/2017/01/18/18/22/headphone-1990516_640.png'        
    },
    price: {
        type: SchemaTypes.Double,
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
}, {tinestamps : true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;