//checks login middleware

//console.log(req.user);
module.exports.isLoggedIn = (req, res, next) => {
  //console.log(req.user);
  //console.log(req.path,"..",req.originalUrl);
  if (!req.isAuthenticated()) {
    //save redirect url here
    req.session.redirectUrl = req.orignalUrl;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    //this redirecturl is stored in the locals variable from auth middleware and this variable is accessed by every route so we redirect after the login page
  }
  next();
};
