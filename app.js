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



//Creating a environment variable to help with deployed version of DB and testing version of DB for our application. 
//url will equal the enviroment variable if it exist, if it doesn't exist it will be local 
var url = process.env.DATABASEURL || "mongodb://localhost:27017/naphthaDevelopment";
console.log(url);
console.log(process.env.DATABASEURL);
// var url = process.env.DATABASEURL;	//this is the mongoDb atlas string
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });


//MIDDLEWARE
//Connecting to a database and or creating a database if one is not set up yet
// mongoose.connect("mongodb://localhost:27017/sdProjectV4_final_version", { useNewUrlParser: true, useCreateIndex: true}, (err) => {
// 	if (err) {
// 		console.error("Failed to connect to mongodb");
// 		throw err;
// 	}
// });




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


// This is where the server will start and listen for the specified port number on whatever environment
// the code is running on for PORT and IP address. e.g. a heroku or goorm ide environment or a local one, hence the 3000.
app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The Naphtha Oil Server Has Started!");
});
