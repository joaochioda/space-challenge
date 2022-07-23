// Define our dependencies
var express = require("express");
var session = require("express-session");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
var request = require("request");
const cors = require("cors");
require("dotenv").config();

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL; // You can run locally with - http://localhost:3000/auth/twitch/callback

// Initialize Express and middlewares

module.exports = function loginTwitch(app) {
  app.use(
    session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
  );
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "Content-Type",
      "Authorization"
    );
    next();
  });
  app.use(
    cors({
      origin: "*", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // allow session cookie from browser to pass through
    })
  );

  app.use(express.static("public"));
  app.use(passport.initialize());
  app.use(passport.session());

  // Override passport profile function to get user profile from Twitch API
  OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
    var options = {
      url: "https://api.twitch.tv/helix/users",
      method: "GET",
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        Accept: "application/vnd.twitchtv.v5+json",
        Authorization: "Bearer " + accessToken,
      },
    };

    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        done(null, JSON.parse(body));
      } else {
        done(JSON.parse(body));
      }
    });
  };

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    "twitch",
    new OAuth2Strategy(
      {
        authorizationURL: "https://id.twitch.tv/oauth2/authorize",
        tokenURL: "https://id.twitch.tv/oauth2/token",
        clientID: TWITCH_CLIENT_ID,
        clientSecret: TWITCH_SECRET,
        callbackURL: CALLBACK_URL,
        state: true,
      },
      function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;

        // Securely store user profile in your DB
        //User.findOrCreate(..., function(err, user) {
        //  done(err, user);
        //});
        done(null, profile);
      }
    )
  );

  // Set route to start OAuth link, this is where you define scopes to request
  app.get(
    "/auth/twitch",
    passport.authenticate("twitch", { scope: "user_read" })
  );

  // Set route for OAuth redirect
  app.get("/auth/twitch/callback", function (req, res, next) {
    passport.authenticate("twitch", function (err, user, info) {
      if (err) {
        return next(err);
      }
      // Redirect if it fails
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        // Redirect if it succeeds
        console.log(user);
        console.log(info);

        return res.redirect(
          `http://localhost:3000/logged?email=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
        );
      });
    })(req, res, next);
  });

  // If user has an authenticated session, display it, otherwise display link to authenticate
  app.get("/", function (req, res) {
    console.log(req.session);
    if (req.session && req.session.passport && req.session.passport.user) {
      res.send("Logado");
    } else {
      res.send("Need login");
    }
  });
};

/*
7bjibkvrwqw9179kttp6wzuynt2bsn
o7ziurosk15euqt25i2qnvoi2mf4r9tq0xcfpmuwm623wwmksy
*/
