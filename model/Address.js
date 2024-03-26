const { ObjectId } = require('mongodb');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    userId: {
        type: ObjectId,
        required : true
    },
    line1: {
        type: String,
        require: true
    },
    line2: {
        type: String,        
    },
    postalCode: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    }
}, { timestamps: true} );

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;