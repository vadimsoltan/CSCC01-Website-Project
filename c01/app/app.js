var path = require('path');
var express = require('express')
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var Datastore = require('nedb');



var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('front_end'));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



var users = new Datastore({ filename: 'db/users.db', autoload: true, timestampData : true});
var DB = new Datastore({ filename: 'db/DB.db', autoload: true, timestampData : true});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


// User constructor
var Users = (function(){


    // return the new create user object
    return function User(userInfo){
        this.username  = userInfo.username;
        
        var salt = crypto.randomBytes(16).toString('base64');
        var hash = crypto.createHmac('sha512', salt);
        hash.update(userInfo.password);
        
        this.salt = salt;
        this.saltedHash = hash.digest('base64');
        this.savedProject = [];
    }
}());

var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.saltedHash === value);
};

// create new user 
app.put('/api/users/', function (req, res, next) {

    var username = req.body.username;

    users.findOne({username: username }, function(err, user) { 

        if(user == null){
            var newUser = new Users(req.body);

            // insert new created user into db
            users.insert(newUser, function (err, newuser) {

                // error checking for db aciton
                if (err) return res.status(500).send("Database error");

                // return the new created comment to frontend
                res.json(newuser); 
                return next();
            });
        }else{
            res.json(null);
            return next();
        }
        
    });
});
// sign in
app.post('/signIn/', function (req, res, next) {
    console.log("__");
    users.findOne({username: req.body.username}, function(err, user){
        if (user == null) return res.json("wrong");
        if (checkPassword(user, req.body.password) == false){
            return res.json("wrong");
        }
        req.session.user = user;
        res.cookie('username', user.username);
        return res.json(user.username);
    });
});

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url);
    return next();
});


app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

app.listen(3000, function () {
  console.log('App listening on port 3000')
});
