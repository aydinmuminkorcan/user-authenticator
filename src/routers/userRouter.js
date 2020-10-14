const express = require('express');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const router = new express.Router();

const googleClientId = process.env.GOOGLE_CLIENT_ID;

const connection = new google.auth.OAuth2(
  googleClientId,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const authClient = new OAuth2Client(googleClientId);

const scope = [
  'openid',
  'email'
];

const googleUrl = connection.generateAuthUrl({
  response_type : 'code',
  access_type: 'offline',
  prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
  scope: scope.join(' ')
});

router.get('/', (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.get('/logIn', (req, res) => {
  res.render('logIn', {
    url: googleUrl,
    formData: {},
    error: {},
    title: 'Log In Page',
    name: 'Mumin Korcan Aydin'
  });
});


router.post('/logIn', (req, res) => {
  const body = req.body;

  var user = null;

  User.findOne({
      userName: body.userName, thirdParty:false
    })
    .then(foundUser => {
      if (!foundUser)
        return res.status(401).render('logIn', {
          url: googleUrl,
          formData: req.body,
          error: {
            message: 'User does not exist, please sign up!'
          },
          title: 'Log in Page',
          name: 'Mumin Korcan Aydin'
        });

      user = foundUser;
      if(!bcrypt.compareSync(body.password, user.password)){
          return res.status(401).render('logIn', {
            url: googleUrl,
            formData: req.body,
            error: {
              message: 'Invalid password'
            },
            title: 'Log in Page',
            name: 'Mumin Korcan Aydin'
          });
      }
      req.session.user = user;
      res.redirect('/users/me');
    })
    .catch(e => {
      console.error(e);
      res.status(500).send(e);
    });
});



router.get('/auth/google/callback', (req, res) => {
  const code = req.query.code;

  if (code) {
    axios({
      method:'post',
      url: 'https://oauth2.googleapis.com/token',
      data: {
        client_id: googleClientId,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
        code:code,
      }
    })
    .then(function (resp) {
      const tokens = resp.data;

      return authClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: googleClientId
      })
    })
    .then(loginTicket => {
      const payload = loginTicket.getPayload();
      
      User.findOne({ userName: payload.email})
        .then(foundUser => {
          if (!foundUser) {
            const user = {
              userName: payload.email,
              password: 'thirdparty',
              age: 99,
              thirdParty: true,
            }

            new User(user).save(function (err) {
              if (err)
                return console.error(err);
              req.session.user = user;
              res.redirect('/users/me');
            });
          } 
          else{
            req.session.user = foundUser;
            res.redirect('/users/me');
          }
        })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send(e);
    });
  }
});

router.get('/logOut', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


router.get('/signUp', (req, res) => {
  res.render('signUp', {
    formData: {},
    error: {},
    title: 'Sign up Page',
    name: 'Mumin Korcan Aydin'
  });
});

router.post('/signUp', (req, res) => {
  const body = req.body;

  User.findOne({
      userName: body.userName
    })
    .then((user) => {
      if (user)
        return res.status(400).render('signUp', {
          formData: req.body,
          error: {
            message: 'User already exists, please log in!'
          },
          title: 'Sign Up Page',
          name: 'Mumin Korcan Aydin'
        });

      return new User(req.body).save()
        .then(user => {
          req.session.user = user;
          return res.redirect('/users/me');
        });
    })
    .catch(e => {
      console.error(e);
      res.status(500).send(e);
    });
});


router.get('/me', (req, res) => {
  if (!req.session.user)
    return res.redirect('/users/login');
 
  const user = req.session.user;

  res.render('user', {
    userName: user.userName,
    name: 'Mumin Korcan Aydin'
  });
});

module.exports = router;