# How Passport Knows the User Model
passport-local-mongoose Plugin:

In your user.js file, you added the passport-local-mongoose plugin to the User schema:
This plugin automatically adds methods like authenticate, register, and findByUsername to the User model.
It also integrates the User model with Passport's LocalStrategy.
passport.use(new LocalStrategy(User.authenticate())):

In your app.js file, you configured Passport to use the LocalStrategy:
The User.authenticate() method is provided by the passport-local-mongoose plugin. It handles authentication by checking the username and password against the database.
passport.authenticate("local"):

When you use passport.authenticate("local") in your route, Passport automatically uses the LocalStrategy you configured earlier.
The LocalStrategy uses the User.authenticate() method to validate the username and password.
Flow of Authentication
User Submits Login Form:

The login form sends the username and password to the /login route.
passport.authenticate("local"):

Passport calls the User.authenticate() method provided by passport-local-mongoose.
This method checks the username and password against the database.
Success or Failure:

If authentication succeeds, Passport attaches the authenticated user to req.user.
If authentication fails, Passport redirects to the failureRedirect route and optionally flashes an error message (failureFlash: true).
Why You Don't Need to Explicitly Pass the User Model
The passport-local-mongoose plugin automatically integrates the User model with Passport. This eliminates the need to manually pass the User model to passport.authenticate.
Conclusion
Passport knows the User model because the passport-local-mongoose plugin automatically integrates the model with Passport's LocalStrategy. This allows passport.authenticate("local") to work seamlessly without explicitly passing the User model.
