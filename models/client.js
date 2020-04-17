// DEPENDENCIES
const mongoose              = require('mongoose'),	
	  passportLocalMongoose = require('passport-local-mongoose');

// THE SCHEMA
//Defining the PATTERN/SHAPING the Schema Model for client
const ClientSchema = new mongoose.Schema({

	newAccount: {
        type: Boolean,
        default: true
    },
	//name
    name: {
        firstName: String,
        lastName: String,
    },
	//username & dateCreated
    username: String,
    dateCreated: { 
        type: String,
        default: Date()
    },
	//password, email, address
    password: String,
    email: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipcode: Number
    },
	//address2
    address2: {
        street: String,
        city: String,
        state: String,
        zipcode: Number
    },
	//quoteHistory
    quoteHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote"
    }]
});

// This line enables passport to recognize this schema and to connect/pass it along to the database
ClientSchema.plugin(passportLocalMongoose); 

// Now we export this out and over to be used by other files
module.exports = mongoose.model("Client", ClientSchema); 