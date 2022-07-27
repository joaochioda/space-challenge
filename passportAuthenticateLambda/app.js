var session = require("express-session");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
var request = require("request");
var jwt = require("jsonwebtoken");

const {
  TWITCH_CLIENT_ID,
  TWITCH_SECRET,
  SESSION_SECRET,
  CALLBACK_URL,
  FRONT_URL,
} = require("./keys_twitch");

console.log(CALLBACK_URL);

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

app.get("/api/info", (req, res) => {
  res.send({ application: "sample-app", version: "1" });
});

app.get("/api/auth/twitch", passport.authenticate("twitch"));

app.get("/auth/twitch/callback", function (req, res, next) {
  passport.authenticate("twitch", function (err, user, info) {
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
      console.log(token);
      // Redirect if it succeeds
      return res.redirect(`${FRONT_URL}/logged?bearer=${token}`);
    });
  })(req, res, next);
});

app.get("/api/v1/hi", (req, res) => {
  res.send({ hi: "there s" });
});

app.post("/api/v1/getback", (req, res) => {
  res.send({ ...req.body });
});
//app.listen(3000, () => console.log(`Listening on: 3000`));
module.exports.handler = serverless(app);

/*
http://localhost:3000/dev/api/auth/twitch - login
https://oux7krwfpi.execute-api.us-east-1.amazonaws.com/dev/api/auth/twitch
http://localhost:3000/dev/auth/twitch/callback - callback
*/
