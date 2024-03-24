const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: {
        type: ObjectId,
        required : true
    },
    itemId: {
        type: [ObjectId],
        required : true
    },
    make: {
        type: [String],
        required : true
    },
    prodName: {
        type: [String],
        required : true
    },
    image: {
        type: [String],      
    },    
    price: {
        type: [Number],
        required : true
    },
    quantity: {
        type: [Number],
        required : true
    },
    category: {
        type: [String],
        required : true
    },
    total: {
        type: Number,
        required: true
    }
}, {timestamps : true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;