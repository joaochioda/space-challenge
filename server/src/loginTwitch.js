// Define our dependencies
var express = require("express");
var session = require("express-session");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
var request = require("request");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL; // You can run locally with - http://localhost:3000/auth/twitch/callback
const FRONT_URL = process.env.FRONT_URL; // You can run locally with - http://localhost:3000/
// Initialize Express and middlewares

module.exports = function loginTwitch(app) {
  console.log("a");
  app.use(
    session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
  );

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
  console.log("b");

  // Override passport profile function to get user profile from Twitch API
  OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
    console.log("c");

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
    console.log("d");

    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    console.log("e");

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
        console.log("f");

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
  app.get("/auth/twitch");

  // Set route for OAuth redirect
  app.get("/auth/twitch/callback", function (req, res, next) {
    console.log("g");

    passport.authenticate("twitch", function (err, user, info) {
      console.log("h");
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
            id: user.data[0].id,
            email: user.data[0].email,
            image: user.data[0].profile_image_url,
            name: user.data[0].display_name,
            accessToken: user.accessToken,
          },
          SESSION_SECRET,
          {
            expiresIn: "24h",
            algorithm: "HS256",
          }
        );
        // Redirect if it succeeds
        return res.redirect(`${FRONT_URL}/logged?bearer=${token}`);
      });
    })(req, res, next);
  });

  // If user has an authenticated session, display it, otherwise display link to authenticate
  app.get("/", function (req, res) {
    if (req.session && req.session.passport && req.session.passport.user) {
      res.send("Logado");
    } else {
      res.send("Need login");
    }
  });

  app.get("/me", (req, res) => {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        const token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, SESSION_SECRET);
        if (decoded) {
          //verify backend if access token is valid
          res.send({ name: decoded.name, image: decoded.image });
        }
      }
    } catch (err) {
      res.status(401).send("Unauthorized");
    }
  });
};

/*
7bjibkvrwqw9179kttp6wzuynt2bsn
o7ziurosk15euqt25i2qnvoi2mf4r9tq0xcfpmuwm623wwmksy
*/
