// DEPENDENCIES
const mongoose = require('mongoose');

//THE SCHEMA
//Defining the PATTERN/SHAPING the Schema Model for quote
const QuoteSchema = new mongoose.Schema({
    gallons: Number,
    address: String,
    orderdate: {
        type: Date,
        default: Date
    },
    deliverydate: {
        type: Date,
        default: null
    },
    suggestedPrice: {
        type: Number,
        default: 0.0
    },
    total: {
        type: Number,
        default: 0.0
    }
});


// Now we export this out and over to be used by other files
module.exports = mongoose.model("Quote", QuoteSchema); 

//=======================================================================