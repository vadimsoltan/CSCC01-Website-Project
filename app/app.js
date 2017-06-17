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
        this.firstName = null;
        this.lastName = null;
        this.location = null;
        this.email = null;
        this.phone = null;
        this.preferences = [];
    }
}());

// Books constructor
var Books = (function(){


    // return the new create book object
    return function Book(bookInfo){
        this.bookname  = userInfo.bookname;
        this.description = userInfo.description;
    }
}());

// Posts constructor, return a newly created post object(json) based on bookinfo, which will be stored into the user relation
var Post = (function(){
    // bookInfo will be passed from the XMLHttpRequest
    return function Post(postInfo){
        this.title = postInfo.title;
        this.description = postInfo.description;
        this.tags = postInfo.tags; // the tag list
        // need further discussion on the image
        this.image = postInfo.image;
        this.date = postInfo.date;
    }
}());

// Message constructor
var Message = (function() {
	return function Message(msgInfo) {
		this.sender = msgInfo.sender;
		this.receiver = msgInfo.receiver;
		this.content = msgInfo.content;
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

// create new post
app.post('/api/posts/', function (req, res, next) {

    var newPost = new Post(req.body);
    // insert newly created post into the relation of posts
    posts.insert(newPost, function (err, newPost) {
    	// error checking for db aciton
    	if (err) return res.status(500).send("Database error");
    	// return the new created comment to frontend
    	res.json(null); 
    	return next();
    });
});

//send message
app.post('/api/messages/', function (req, res, next) {
	
	var newMsg = new Message(req.body);
	users.findOne({username: newMsg.sender}, function(err, user) {
		if (user == null) return res.json("wrong receiver");
		else {
			messages.insert(newMsg,function(err, newMsg) {
				if (err) return res.status(500).send("Database error");
			});
		}
		res.json(null);
		return next();
	});
});

//get received messages
app.get('/api/messages/', function (req, res, next) {
	
	var rec = req.body.receiver;
	messages.find({receiver: rec}, function(err, msgs) {
		if (err) return res.status(500).send("Database error");
		res.json(msgs);
		return next();
	});
});

//get send messages
app.get('/api/messages/', function (req, res, next) {
	
	var send = req.body.sender;
	messages.find({sender: send}, function(err, msgs) {
		if (err) return res.status(500).send("Database error");
		res.json(msgs);
		return next();
	});
});
		
	

// sign in
app.post('/signIn/', function (req, res, next) {
    users.findOne({username: req.body.username}, function(err, user){
        if (user == null) {
            return res.json("notRegistered");
        } else if (checkPassword(user, req.body.password) == false){
            return res.json("wrong");
        }
        req.session.user = user;
        res.cookie('username', user.username);
        return res.json(user.username);
    });
});

//signout
app.delete('/signOut/', function (req, res, next) {
    res.cookie('username',null);
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.end();
    });
});

//update user
app.put('/api/:username/profile/', function (req, res, next) {
	var username = req.params.username;
	console.log(username);
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var location = req.body.location;
	var email = req.body.email;
	var phone = req.body.phone;
	var preferences = req.body.preferences;
	users.update({ "username": username }, { $set: { "firstName":firstName,"lastName": lastName, "email": email, "location": location,"phone" : phone,"preferences":preferences} }, {}, function (err, numReplaced) {
		console.log(numReplaced);
		return res.json(numReplaced);
	});
});

//get profile of user
app.get('/api/:username/', function (req, res, next) {
    console.log("here");
    var username = req.params.username;
    users.findOne({ "username": username }, function (err, userinfo) {
        console.log(userinfo);
        return res.json(userinfo);
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
