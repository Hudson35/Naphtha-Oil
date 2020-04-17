//Requiring in packages
var express     = require("express"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    Quote = require("../models/quote"),
	Client  = require("../models/client"),
	pricingModule =	require("../js/pricingModule.js"),
	router      = express.Router(),
	moment = require("moment"); 

/* BELOW ARE THE GET AND POST ROUTES */

//GET ROUTE - HOME PAGE
// if the user is new then render the clientProfile.ejs file, else if they are pre-existing then render the home.ejs file
router.get("/home", (req, res) =>{
	if(req.user.newAccount === true){
		res.render("clientProfile", {client: req.user});
	} else {
		res.render("home", {client: req.user});
	}
});

//GET ROUTE FOR - clientProfile PAGE 
router.get("/clientProfile", (req, res) =>{
	res.render('clientProfile');
});

//POST ROUTE FOR - clientProfile PAGE
router.post("/clientProfile", (req, res) =>{
	//userData used to be called clientData
	var clientData = {
		"newAccount": false,
		"username": req.user.username,
		"name": {
			"firstName": req.body.registerfirstname,	
			"lastName": req.body.registerlastname,	
		},
		"email": req.body.registeremail,
		"address": {
			"street": req.body.registerhomeaddress,
			"city": req.body.registercity,
			"state": req.body.registerstate,
			"zipcode": req.body.registerzip,
		},
		"address2": {
            "street": req.body.registerhomeaddress2, 
            "city": req.body.registercity2, 
            "state": req.body.registerstate2, 
            "zipcode": req.body.registerzip2,
        }
	};
	Client.findByIdAndUpdate(req.user._id, clientData, (error, client) => {
		if(error){
			console.log(error);
			res.render("clientProfile", {client: req.user});
		} else{
			console.log("Just updated " + client.username + "'s information in the database!");
			//saving the newly updated information in the database 
			client.save();
		}
	});
	message = {
		type: "success",
		messageHeader: "Registration Completed!",
		messageBody: "Please Login to continue towards getting your Quote."
	};
	res.render("login", message);
});

//=========================================================================

//GET ROUTE FOR - GET A QUOTE PAGE
router.get("/home/fuelQuoteForm", (req, res) => {
    res.render("fuelQuoteForm", { client: req.user });
});

//POST ROUTE FOR - GET A QUOTE PAGE
router.post("/home/fuelQuoteForm", (req, res) => {
    let newQuote;
    let month = Number((req.body.quote.orderdate).substring(0, 2));
	let deliveryMonth = Number((req.body.quote.deliverydate).substring(0,2));
	let orderDay = Number((req.body.quote.orderdate).substring(3,5));
	let deliveryDay = Number((req.body.quote.deliverydate).substring(3,5));
	let suggested = pricingModule.getSuggestedPrice(req.user.address.state, month, req.user.fuelQuoteHistory, req.body.quote.gallons);
    let total = pricingModule.getTotal(req.body.quote.gallons, suggested);

	console.log(month + " " + orderDay);
	console.log(deliveryMonth + " " + deliveryDay);
	
	if(month > deliveryMonth){
		console.log("Error - Invalid delivery month.");
        res.redirect('/clients/home/fuelQuoteForm');
	} else {
        if(orderDay > deliveryDay) {
            console.log("Error - Invalid delivery day.");
            res.redirect('/clients/home/fuelQuoteForm');
        } else{
			newQuote = new Quote({
        		gallons: req.body.quote.gallons,
        		address: {
					street: req.user.address.street,
					city: req.user.address.city,
					state: req.user.address.state,
					zipcode: req.user.address.zipcode     
        		},
				orderdate: req.body.quote.orderdate,
				deliverydate: req.body.quote.deliverydate,
				suggestedPrice: suggested,
				total: total,
    		}).toJSON();
			newQuote.deliverydate = req.body.quote.deliverydate;
			res.render('fuelQuoteInfo', { 
        		client: req.user, 
        		quote: newQuote
    		});
		}
	}
});

// GET ROUTE FOR - FUEL QUOTE INFO PAGE (showing)
router.get('/home/fuelQuoteInfo', (req, res) => {
    res.render('fuelQuoteInfo', { 
        client: req.user,
        quote: []
     });
});

//POST ROUTE FOR - FUEL QUOTE INFO PAGE
//Inserting data into database
router.post('/home/fuelQuoteInfo', (req, res) => {
    Client.findById(req.user._id).populate('quoteHistory').exec((err, client) => {	//ejs file still need to be fuelQuoteHistory not quoteHistory
        if(err) {
            console.log(err);
        } else {
            Quote.create(req.body.quote, (err, quote) => {
                if(err) {
                    console.log(err);
                    res.redirect('/clients/home/fuelQuoteInfo');
                } else {
                    client.quoteHistory.push(quote);	//quoteHistory is from schema
                    quote.save();
                    client.save();
                    res.render('home', {
                        client: client,
                        quotes: client.quoteHistory,	//quoteHistory is from schema
                    });
                }
            });
        }
    });
});

//GET ROUTE FOR - QUOTE HISTORY PAGE
router.get('/home/fuelQuoteHistory', (req, res) => {
	// alert('hello');
    Client.findById(req.user._id).populate('quoteHistory').exec((err, client) => { 
		//console.log('abc');
		
		client = client.toJSON();
		
		client.quoteHistory.forEach(c => {
			if (c.deliverydate) {
				c.deliverydate = moment(c.deliverydate).format("LLL");
				// c.deliverydate = moment(c.deliverydate).format('MMMM Do YYYY, h:mm:ss a');
			}
			
			c.orderdate = moment(c.orderdate).format("LLL");
			// c.orderdate = moment(c.orderdate).format('MMMM Do YYYY, h:mm:ss a');
		});
        if(err) {
            console.log(err);
            res.redirect('/clients/home');
        } 
		else {
			//console.log(res);
			//console.log('xyz');
            res.render('fuelQuoteHistory', {
                client: client,
                quotes: client.quoteHistory,
            });
        }
    });
});

// GET ROUTE FOR - LOGGING OUT 
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
   