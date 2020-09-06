const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = new express.Router();


router.get('/', (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router.get('/logIn', (req, res) => {
  res.render('logIn', {
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
      userName: body.userName
    })
    .then(foundUser => {
      if (!foundUser)
        return res.status(400).render('logIn', {
          formData: req.body,
          error: {
            message: 'User does not exist, please sign up!'
          },
          title: 'Log in Page',
          name: 'Mumin Korcan Aydin'
        });

      user = foundUser;
      return bcrypt.compare(body.password, user.password)
    })
    .then(match => {
      if (!match)
        return res.status(400).render('logIn', {
          formData: req.body,
          error: {
            message: 'Invalid password'
          },
          title: 'Log in Page',
          name: 'Mumin Korcan Aydin'
        });
      req.session.user = user;
      res.redirect('/users/me');
    }).catch(e => {
      console.error(e);
      res.status(500).send(e);
    });
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

  res.render('user', {
    userName: req.session.user.userName,
    name: 'Mumin Korcan Aydin'
  });
});




module.exports = router;