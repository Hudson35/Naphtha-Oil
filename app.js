 //DEPENDENCIES
const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
	  cookieParser= require('cookie-parser'),
      passport    = require("passport"),
	  passportLocalMongoose = require("passport-local-mongoose"),
      LocalStrategy = require("passport-local").Strategy,
      Quote = require("./models/quote"),
	  Client  = require("./models/client");
const port = process.env.PORT || 3000;

var messages = [];
  
//======================================

var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

//======================================


//MIDDLEWARE
//Connecting to a database and or creating a database if one is not set up yet
mongoose.connect("mongodb://localhost:27017/sdProjectV4_final_version", { useNewUrlParser: true, useCreateIndex: true}, (err) => {
	if (err) {
		console.error("Failed to connect to mongodb");
		throw err;
	}
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again You have decoded the Secret Message!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


//ROUTES
app.use('/', require('./routes/index'));
app.use('/clients', require('./routes/clients'));


//SERVER RESPONSE 
app.listen(port, function () {
  console.log("Server started!");
});