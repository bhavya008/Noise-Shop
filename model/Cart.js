const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    make: {
        type: String,
        required : true
    },
    prodName: {
        type: String,
        required : true
    },
    price: {
        type: SchemaTypes.Double,
        required : true
    },
    quantity: {
        type: Number,
        required : true
    }
}, {tinestamps : true});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;