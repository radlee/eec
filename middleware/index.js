function requiresLogin(req, res, next){
  if(req.session && req.session.user){
    return next();
  }
  else {
    req.flash("warning", "You must be logged in to view this page.");
    return res.redirect("/login");
  }
}
module.exports.requiresLogin = requiresLogin;
