const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();
const mysql  = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const myConnection = require('express-myconnection');
const flash = require('express-flash');
const mid = require('./middleware');
const login = require('./routes/login');
//Start the server
app.set('port', (process.env.PORT || 5007));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(flash());
//setup handlebars
app.engine('hbs', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');

app.use(session
  (
    {
      secret: 'theonlyoneknown',
      resave: false,
      saveUninitialized: true,
      cookie: {maxAge: 600000}
    }
  )
);
//Make userID available in all templates
// Creating a Middleware
app.use(function(req, res, next){
  res.locals.currentUser = req.session.userID;
  next();
});
app.get("/", mid.requiresLogin, function(req, res, next){
  res.render("home",  {user:req.session.user});
});
app.get("/home", mid.requiresLogin, function(req, res){
  res.render("home",  {user:req.session.user});
})
app.get("/login", function(req, res, next){
  res.render("login")
})
app.get("/projects", mid.requiresLogin, function(req, res){
  res.render("projects", {
    user: req.session.user
  })
});
app.get("/blog", mid.requiresLogin, function(req, res){
  res.render("blog", {
    user: req.session.user
  })
});
app.get("/contact", mid.requiresLogin, function(req, res){
  res.render("contact", {
    user: req.session.user
  })
});
app.get("/about", function(req, res){
  res.render("about", {
    user: req.session.user
  })
});

// Routed Views
app.post("/login", login.login);
// Delete the User session on logout
app.get("/logout", function(req, res){
  delete req.session.user;
  res.redirect("/login");
});
function errorHandler(err, req, res, next){
  res.status(500);
  res.render('error', {error:err});
}
app.use(errorHandler);
app.listen(app.get('port'), function(){
    console.log('Running @ port :' , app.get('port'));
});
