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
var posts = new Datastore({ filename: 'db/posts.db', autoload: true, timestampData : true});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


// User constructor
var Users = (function(){


    // return the new create user object
    return function User(userInfo){
        if (userInfo.password == undefined) {
            this.username  = userInfo.username;
            this.name = userInfo.name;                
            this.email = userInfo.email;
            this.location = null;
            this.phone = null;
            this.preferences = [];
            this.image = "https://lh3.googleusercontent.com/ZZPdzvlpK9r_Df9C3M7j1rNRi7hhHRvPhlklJ3lfi5jk86Jd1s0Y5wcQ1QgbVaAP5Q=w300"
            this.type = "user";
        } else {
            this.username  = userInfo.username;
            var salt = crypto.randomBytes(16).toString('base64');
            var hash = crypto.createHmac('sha512', salt);
            hash.update(userInfo.password);
            
            this.salt = salt;
            this.saltedHash = hash.digest('base64');
            this.name = null;
            this.location = null;
            this.email = userInfo.email;
            this.phone = null;
            this.preferences = [];
            this.image = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
            this.type = "user";
        }
    }
}());

// Posts constructor, return a newly created post object(json) based on bookinfo, which will be stored into the user relation
var Post = (function(){
    // bookInfo will be passed from the XMLHttpRequest
    return function Post(postInfo){
        this.username = postInfo.username;
        this.title = postInfo.title;
        this.description = postInfo.description;
        this.tags = postInfo.tags; // the tag list
        // need further discussion on the image
        this.image = postInfo.image;
        this.date = postInfo.date;
        this.author = postInfo.author;
        this.price  = postInfo.price;
    }
}());



var checkPassword = function(user, password){
        var hash = crypto.createHmac('sha512', user.salt);
        hash.update(password);
        var value = hash.digest('base64');
        return (user.saltedHash === value);
};

// User

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

//still sign in
app.post('/stillLogin/:username/', function (req, res, next) {
    users.findOne({username: req.params.username}, function(err, user){
        req.session.user = user;
        return res.json(user.username);
    });
});

// facebook sign in
app.post('/facebookLogin/', function (req, res, next) {
	var username = req.body.username;
	var newUser = new Users(req.body);
	users.findOne({username: username }, function(err, user) { 

        if(user == null){
            // insert new created user into db
            users.insert(newUser, function (err, newUser) {

                // error checking for db aciton
                if (err) return res.status(500).send("Database error");

                // return the new created comment to frontend
                req.session.user = newUser;
        		res.cookie('username', newUser.username);
                return res.json(newUser);
            });
        }else{
            req.session.user = user;
            res.cookie('username', user.username);
            return res.json(user);
        }
        
    });
});

// create new user 
app.put('/api/users/', function (req, res, next) {

    var username = req.body.username;
    var email = req.body.email;

    users.findOne({$or: [{ username: username }, { email: email }]}, function(err, user) { 
        if(user == null){
            var newUser = new Users(req.body);

            // insert new created user into db
            users.insert(newUser, function (err, newUser) {

                // error checking for db aciton
                if (err) return res.status(500).send("Database error");

                // return the new created comment to frontend
                req.session.user = newUser;
        		res.cookie('username', newUser.username);
                return res.json(newUser.username);
            });
        }else{
            res.json(null);
            return next();
        }
        
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
    var name = req.body.name;
    var location = req.body.location;
    var email = req.body.email;
    var phone = req.body.phone;
    var preferences = req.body.preferences;
    users.update({ "username": username }, { $set: { image:req.body.image,"name":name, "email": email, "location": location,"phone" : phone,"preferences":preferences} }, {}, function (err, numReplaced) {
        return res.json(numReplaced);
    });
});

//get profile of user
app.get('/api/:username/', function (req, res, next) {
    var username = req.params.username;
    users.findOne({ "username": username }, function (err, userinfo) {
        return res.json(userinfo);
    });
});

//get profile of all posts
app.get('/api/posts/all/',function (req, res, next) {
    posts.find({}).sort({createdAt:-1}).limit(10).exec(function(err,data) {
        return res.json(data);
    })
})

// get posts of a user

app.get('/api/posts/:username/',function (req, res, next) {
    var username = req.params.username;
    posts.find({username:username}).sort({createdAt:-1}).exec(function(err,data) {
        return res.json(data);
    })
})

app.put('/api/resetPassword/',function (req, res, next) {
    console.log(req.body)
    var email = req.body.email;
    var password = req.body.newPassword;
    console.log(password)
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
            
    users.update({email: email},{$set : {"salt": salt, "saltedHash" : hash.digest('base64')}},{},function(err,data) {

        return res.json(data);
    })
})


// create new post
app.post('/api/posts/', function (req, res, next) {
    var newPost = new Post(req.body);
    var username = req.session.user.username
    // insert newly created post into the relation of posts
    posts.count({username:username},function(err,count) {
    	if (count >= 10) {
    		return res.json("Max");
    	} else {
    		posts.insert(newPost, function (err, newPost) {
	    		// error checking for db aciton
	    		if (err) return res.status(500).send("Database error");
	    		// return the new created comment to frontend
	    		return res.json(newPost);
    		});
    	};
    })
});

// get posts by id

app.get('/api/postsId/:id/',function (req, res, next) {
    var id = req.params.id;
    posts.findOne({_id:id}, function(err,data) {
        users.findOne({username:data.username}, function(err,newData) {
            data.userImage = newData.image;
            data.email = newData.email;
            data.name = newData.name;
            return res.json(data);
        })
    })
})


// update a post with given id
app.put('/api/updatePosts/:id/', function (req, res, next) {

    var id = req.params.id;
    var title = req.body.title;
    var description = req.body.description;
    var tags = req.body.tags;
    var image = req.body.image;
    var date = req.body.date;
    posts.update({"_id": id}, { $set: { "title":title,"description": description, "tags": tags, "image": image,"date" : date} }, {}, function (err, numReplaced) {
		return res.json(numReplaced);
	});
});

//get next page posts
app.get('/api/posts/next/:id/',function (req, res, next) {
    var id = req.params.id;
    posts.findOne({"_id":id},function (err, date) {
        posts.find({createdAt:{$lt: date.createdAt}}).sort({createdAt:-1}).limit(10).exec(function(err,data) {
            return res.json(data)
        })
    })
})

//get previous page posts
app.get('/api/posts/previous/:id/',function (req, res, next) {
    var id = req.params.id;
    var dataList = [];
    posts.findOne({"_id":id},function (err, date) {
        posts.find({createdAt:{$gt: date.createdAt}}).sort({createdAt:-1}).exec(function(err,data) {

            for (var i = data.length -1;i > data.length -11;i--) {
                dataList.push(data[i])
            }
            return res.json(dataList.reverse())
        })
    })
})

app.get('/api/search/:info/',function (req, res, next) {
    var info = req.params.info;
    var dataList = [];
    posts.find({}).sort({createdAt:-1}).exec(function(err,data) {

        for (var i=0;i < data.length;i++) {
            if (data[i].title == null) {
                data[i].title = "";
            }
            if (data[i].author == null) {
                data[i].author = "";
            }
            if (data[i].description == null) {
                data[i].description = "";
            }
            if (data[i].title.includes(info) == true || data[i].description.includes(info) == true || data[i].author.includes(info) == true || data[i]._id == info) {
                dataList.push(data[i])
            }
            if (dataList.length == 10) {
                return res.json(dataList);
            }
        }
        
        return res.json(dataList);
    })
})


app.get('/api/posts/nextSearch/:id/:info/',function (req, res, next) {
    var id = req.params.id;
    var info = req.params.info;
    var dataList = [];
    posts.findOne({"_id":id},function (err, date) {
        posts.find({createdAt:{$lt: date.createdAt}}).sort({createdAt:-1}).exec(function(err,data) {

            for (var i=0;i < data.length;i++) {
                if (data[i].title == null) {
                    data[i].title = "";
                }
                if (data[i].author == null) {
                    data[i].author = "";
                }
                if (data[i].description == null) {
                    data[i].description = "";
                }
                if (data[i].title.includes(info) == true || data[i].description.includes(info) == true || data[i].author.includes(info) == true) {
                    dataList.push(data[i])
                }
                if (dataList.length == 10) {
                    return res.json(dataList);
                }
            }
            
            return res.json(dataList);
        })
    })
})

app.get('/api/posts/previousSearch/:id/:info/',function (req, res, next) {
    var id = req.params.id;
    var info = req.params.info;
    var dataList = [];
    posts.findOne({"_id":id},function (err, date) {
        posts.find({createdAt:{$gt: date.createdAt}}).sort({createdAt:-1}).exec(function(err,data) {

            for (var i=data.length-1;i > -1;i--) {
                if (data[i].title == null) {
                    data[i].title = "";
                }
                if (data[i].author == null) {
                    data[i].author = "";
                }
                if (data[i].description == null) {
                    data[i].description = "";
                }
                if (data[i].title.includes(info) == true || data[i].description.includes(info) == true || data[i].author.includes(info) == true) {
                    dataList.push(data[i])
                }
                if (dataList.length == 10) {
                    return res.json(dataList.reverse());
                }
            }
            
            return res.json(dataList.reverse());
        })
    })
})

// delete post
app.delete('/api/posts/:id/', function (req, res, next) {
    
    var id = req.params.id;
    posts.remove({_id: id}, {}, function(err, numRemove) {
        if (err) return res.status(500).send("Database error");
        return res.json(numRemove);
    });
});


//send email
app.post('/api/contactUs/',function(req,res,next) {
	sendMail(req.body);
    return next();
})

app.post('/api/report/',function(req,res,next) {
    report(req.body);
    return next();
})

app.post('/api/reset/:email/',function(req,res,next) {
    reset(req.params.email);
    return next();
})


app.post('/api/contactForm/',function(req,res,next) {
    console.log("api")
    contactForm(req.body);
    return next();
})




function sendMail(formData) {

	var name = formData.name;
	var email = formData.email;
	var subject_ = formData.subject;
	var message = formData.message;
	var str = "Name: " + name + ",      " + "Email: " + email + ",      " + "Subject: " + subject_ + ",      " + "Comment: " + message + ".";
	 
    var sg = require('sendgrid')("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");
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: 'haitao.zhu@mail.utoronto.ca'
              }
            ],
            subject: 'contactUs'
          }
        ],
        from: {
          email: 'vickershhh@gmail.com'
        },
        content: [
          {
            type: 'text/plain',
            value: str
          }
        ]
      }
    });

    // With callback
    sg.API(request, function (error, response) {
      if (error) {
        console.log('Error response received');
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });

}

function report(formData) {
    var reporter = formData.reporter;
    var id = formData.id;
    var reason = formData.reason;
    var str = "Reporter: " + reporter + ",      " + "PostId: " + id + ",      " + "Reason: " + reason + ".";
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email('vickershhh@gmail.com');
    var toEmail = new helper.Email('haitao.zhu@mail.utoronto.ca');
    var subject = 'Report';
    var content = new helper.Content('text/plain', str);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
      if (error) {
        console.log('Error response received');
      }
      // console.log(response);
      // console.log(response.statusCode);
      // console.log(response.body);
      // console.log(response.headers);
    });
}

function contactForm(formData) {
    var receiver = formData.receiver;
    var receiverEmail = formData.receiverEmail
    var subject = formData.subject;
    var message = formData.message;
    var email = formData.email;
     console.log(receiverEmail);
     console.log(email);
    var str = "Hi " + receiver + "    Message :  " + message;  
    var helper = require('sendgrid').mail;
    var fromEmail = new helper.Email(email);
    var toEmail = new helper.Email(receiverEmail);
    var subject = subject;
    var content = new helper.Content('text/plain', str);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
      if (error) {
        console.log('Error response received');
      }
      console.log(response);
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
}

function reset(email) {
    var sg = require('sendgrid')("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");
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [
          {
            to: [
              {
                email: email
              }
            ],
            subject: 'Sending with SendGrid is Fun'
          }
        ],
        from: {
          email: 'vickershhh@gmail.com'
        },
        content: [
          {
            type: 'text/html',
            value: '<p>Please click the link to reset your password</p><br><br><a href=http://localhost:3000/passwordReset.html?email=' + email + '>Clickme</a>'
          }
        ]
      }
    });

    // With callback
    sg.API(request, function (error, response) {
      if (error) {
        console.log('Error response received');
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
}


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
