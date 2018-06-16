"use strict"

var rolesMap =
{
  "Admin" : "admin",
  "Tutor-one" : "user"
}

exports.login = function(req, res, next){
  if(req.body.username){
    var user =
    {
      inputName : req.body.username,
      inputPassword: req.body.password
    }
    if(user.inputName == "Admin" && user.inputPassword == "admin-321"){
      req.session.user =
      {
        name : req.body.username,
        is_admin : rolesMap[req.body.username] === "admin",
        user : rolesMap[req.body.username] === "user"
      };
      req.flash("warning", "Login Successful!");
      return res.render("home", {user: req.session.user});
    }
    else if(user.inputName == "Admin" && user.inputPassword != "admin-321"){
      req.flash("warning", "Wrong Password");
      console.log("Wrong Password!");
      return res.redirect("/login");
    }
    else if(user.inputName != "Admin"){
      req.flash("warning", "No such user name, Register for Free");
      console.log("User Does not Exist!");
      return res.redirect("/login");
    }
  }
  else{
    req.flash("warning", "Email and Password are required.");
    return res.redirect("/login");
  }
}
