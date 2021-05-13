const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();
const session = require('express-session');
// Mailer
var nodemailer = require('nodemailer');
const multiparty = require("multiparty");
require("dotenv").config();

const flash = require('express-flash');
const mid = require('./middleware');
const login = require('./routes/login');
//Start the server
app.set('port', (process.env.PORT || 5007));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
app.use(express.static('public'));
app.use(flash());
//setup handlebars
app.engine('hbs', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'hbs');

app.use(session
  (
    {
      secret: 'theonlyoneknown',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 600000 }
    }
  )
);
//Make userID available in all templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userID;
  next();
});
app.get("/", mid.requiresLogin, function (req, res, next) {
  res.render("home", { user: req.session.user });
});
app.get("/home", mid.requiresLogin, function (req, res) {
  res.render("home", { user: req.session.user });
})
app.get("/login", function (req, res, next) {
  res.render("login")
})
app.get("/services", mid.requiresLogin, function (req, res) {
  res.render("services", {
    user: req.session.user
  })
});
app.get("/operation", mid.requiresLogin, function (req, res) {
  res.render("operation", {
    user: req.session.user
  })
});
app.get("/media_relations", mid.requiresLogin, function (req, res) {
  res.render("media_relations", {
    user: req.session.user
  })
});
app.get("/relations", mid.requiresLogin, function (req, res) {
  res.render("relations", {
    user: req.session.user
  })
});
app.get("/contact", function (req, res) {
  res.render("contact", {
    user: req.session.user
  })
});
app.get("/about", function (req, res) {
  res.render("about", {
    user: req.session.user
  })
});

// Emailer---------------------------------------

const transporter = nodemailer.createTransport({
  //host: "smtp.live.com", 
  host: "smtp-mail.outlook.com", //replace with your email provider
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log(success, "Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};
  console.log("Data : ", data);
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    //2. You can configure the object however you want
    const mail = {
      from: data.from_email,
      to: process.env.EMAIL,
      subject: data.subject,
      fullnames: data.fullnames,
      text: data.message,
    };

    //3.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something went wrong.");
      } else {
        res.status(200).send("Email successfully sent to recipient!");
      }
    });
  });
});


// Routed Views
app.post("/login", login.login);
// Delete the User session on logout
app.get("/logout", function (req, res) {
  delete req.session.user;
  res.redirect("/login");
});
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
app.use(errorHandler);
app.listen(app.get('port'), function () {
  console.log('Running @ port :', app.get('port'));
});
