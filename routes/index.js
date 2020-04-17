//Requiring in packages
const express       = require('express'),
	  LocalStrategy = require('passport-local').Strategy,
      passport      = require('passport'),
      Client        = require('../models/client'),
      router        = express.Router();

	passport.use(new LocalStrategy(Client.authenticate()));
	passport.serializeUser(Client.serializeUser());
	passport.deserializeUser(Client.deserializeUser());      

/* BELOW ARE THE GET AND POST ROUTES */

// GET ROUTE FOR - LANDING PAGE
router.get("/", (req, res) => { res.render('landing'); });

// GET ROUTE FOR - LOGIN PAGE
router.get("/login", (req, res) => { 
    message = { type: 'null' };
    res.render('login', message); 
});

// POST ROUTE FOR - LOGIN PAGE: have to authenticate
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/clients/home",
    failureRedirect: "/login"
}));

// GET ROUTE FOR - REGISTRATION PAGE
router.get("/register", (req, res) => { 
    message = { type: 'null' };
    res.render('register', message); 
});

// POST ROUTE FOR REGISTRATION PAGE
router.post("/register", (req, res) => {
    let newClient = new Client({ 
        newAccount: true,
        username: req.body.registerusername,
        dateCreated: Date()
    });
    
    if(req.body.registerpassword === req.body.confirmpassword) {
        Client.register(newClient, req.body.registerpassword, (error, client) => {
            if (error) {
                console.log(error);
                message = { 
                    type: 'error',
                    messageHeader: "ALERT! Something went wrong, an error has happended!",
                    messageBody: error.message + '.'
                };
                return res.render('register', message);
            }
            passport.authenticate("local", (_err, client) => {
                if (_err) {
                    console.log(_err);
                    message = { 
                        type: 'error',
                        messageHeader: "ALERT! Something went wrong, an error has happended!",
                        messageBody: _err.message + '.'
                    };
                    res.render('register', message);
                }
            });
 
            res.render('login');
        });
    } else {
        message = {
            type: 'error',
            messageHeader: 'An error has happended.',
            messageBody: 'It appears that the passwords do not match!' 
        };
        res.render('register', message);
    }
});

module.exports = router;