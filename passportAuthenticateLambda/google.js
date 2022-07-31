var session = require("express-session");
var passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

var request = require("request");
var jwt = require("jsonwebtoken");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  SESSION_SECRET,
  CALLBACK_URL,
  FRONT_URL,
} = require("./keys_google");

// console.log(CALLBACK_URL);

const serverless = require("serverless-http");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);

app.use(passport.initialize());
app.use(passport.session());

authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    authUser
  )
);

passport.serializeUser((user, done) => {
  // The USER object is the "authenticated user" from the done() in authUser function.
  // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

  done(null, user);
});

passport.deserializeUser((user, done) => {
  // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
  // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

  done(null, user);
});

app.get(
  "/google/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/google/auth/google/callback", function (req, res, next) {
  passport.authenticate("google", function (err, user, info) {
    if (err) {
      return next(err);
    }
    // Redirect if it fails
    if (!user) {
      return res.redirect(`/login`);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      var token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          image: user.picture,
          name: user.displayName,
          accessToken: user.accessToken,
        },
        SESSION_SECRET,
        {
          expiresIn: "24h",
          algorithm: "HS256",
        }
      );
      // Redirect if it succeeds
      return res.redirect(`${FRONT_URL}/logged?bearer=${token}?service=google`);
    });
  })(req, res, next);
});

app.get("/google/api/v1/hi", (req, res) => {
  res.send({ hi: "hello google" });
});

// app.post("/api/v1/getback", (req, res) => {
//   res.send({ ...req.body });
// });
module.exports.handler = serverless(app);

// /*
// http://localhost:3000/dev/api/auth/twitch - login
// https://oux7krwfpi.execute-api.us-east-1.amazonaws.com/dev/api/auth/twitch
// http://localhost:3000/dev/auth/twitch/callback - callback
// */
