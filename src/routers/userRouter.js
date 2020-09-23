const express = require('express');
const bcrypt = require('bcryptjs');
const {google} = require('googleapis');
const request = require('request');

const User = require('../models/user');
const router = new express.Router();

const googleConfig = {
  clientId: '91143041520-c2g8a1uujkjpjpf3bb28pmdmv18md3qt.apps.googleusercontent.com',
  clientSecret: 'lXmz0457TK-R7z-84pU01jbS',
  redirect: 'http://localhost:3000/users/auth/google/callback'
};

const connection = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
);

const scope = [
  'https://mail.google.com'
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
 //  Simple authentication without passportjs
  const body = req.body;

  var user = null;

  User.findOne({
      userName: body.userName
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
    connection.getToken(code, function (err, tokens) {
      if (err) {
        console.log(err);
      } else {        
        request({
          url: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
          headers: {
            Authorization : 'Bearer '+tokens.access_token
          }
        }, 
        
        function(err, resp, respBody){
          if(err)
            return console.error(err);

          const body = JSON.parse(respBody);

          User.findOne({
              userName: body.emailAddress
            })
            .then(foundUser => {
              if (!foundUser){
                const user = {
                  userName: body.emailAddress,
                  password: 'googlepass',
                  age: 99
                }
                new User(user).save(function(err){
                  if(err)
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
            .catch(e => {
              console.error(e);
              res.status(500).send(e);
            });
        });
      }
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