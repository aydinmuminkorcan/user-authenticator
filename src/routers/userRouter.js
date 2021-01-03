const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');

const csurfProtection = csurf({ cookie: true });

const User = require('../models/user');
const google = require('../helpers/googleAuth');

const router = new express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
});

router.get('/logIn', csurfProtection, (req, res) => {
    const token = req.csrfToken();

    console.log('Given token : ', token);

    res.render('logIn', {
        url: google.url,
        formData: {},
        error: {},
        csurfToken: token,
        title: 'Sign In',
    });
});

router.post('/logIn', csurfProtection, limiter, (req, res) => {
    const { body } = req;

    let user = null;

    User.findOne({
        userName: body.userName,
        thirdParty: false,
    })
        .then((foundUser) => {
            if (!foundUser)
                return res.status(401).render('logIn', {
                    url: google.url,
                    formData: req.body,
                    error: {
                        message: 'User does not exist, please sign up!',
                    },
                    title: 'Sign In',
                });

            user = foundUser;
            if (!bcrypt.compareSync(body.password, user.password)) {
                return res.status(401).render('logIn', {
                    url: google.url,
                    formData: req.body,
                    error: {
                        message: 'Invalid password',
                    },
                    title: 'Sign In',
                });
            }

            req.session.user = user; // Save user in the session object to use in the subsequent requests
            return res.redirect('/users/me');
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        });
});

// After the users enter their google credentials, they are redirected to this path by google with an authorization code
router.get('/auth/google/callback', (req, res) => {
    const { code } = req.query;

    if (code) {
        google
            .getAuthorizationToken(code)
            .then((tokens) => google.verifyIdentity(tokens.id_token))
            .then((loginTicket) => {
                const payload = loginTicket.getPayload();

                User.findOne({ userName: payload.email }).then((foundUser) => {
                    if (!foundUser) {
                        const user = {
                            userName: payload.email,
                            password: 'thirdparty',
                            age: 99,
                            thirdParty: true,
                        };

                        new User(user).save((err) => {
                            if (err) return console.error(err);
                            req.session.user = user;
                            return res.redirect('/users/me');
                        });
                    } else {
                        req.session.user = foundUser;
                        res.redirect('/users/me');
                    }
                });
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send(e);
            });
    }
});

router.get('/logOut', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/signUp', csurfProtection, (req, res) => {
    res.render('signUp', {
        url: google.url,
        formData: {},
        error: {},
        csurfToken: req.csrfToken(),
        title: 'Sign up',
    });
});

router.post('/signUp', csurfProtection, (req, res) => {
    const { body } = req;

    User.findOne({ userName: body.userName })
        .then((user) => {
            if (user)
                return res.status(400).render('signUp', {
                    formData: req.body,
                    error: {
                        message: 'User already exists, please log in!',
                    },
                    title: 'Sign Up',
                });

            return new User(req.body)
                .save()
                .then((savedUser) => {
                    req.session.user = savedUser;
                    return res.redirect('/users/me');
                })
                .catch((e) => {
                    res.status(400).render('signUp', {
                        formData: req.body,
                        error: {
                            message: e.message,
                        },
                        title: 'Sign Up',
                    });
                });
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        });
});

router.get('/me', (req, res) => {
    if (!req.session.user) return res.redirect('/users/login');

    const { user } = req.session;

    return res.render('dashboard', {
        userName: user.userName,
        title: 'Dashboard',
    });
});

module.exports = router;
