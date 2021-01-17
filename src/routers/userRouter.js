const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const csurf = require('csurf');

// This middleware protects the form submission endpoints from CSRF attack
const csurfProtection = csurf({ cookie: true });

const User = require('../models/user');
const google = require('../helpers/googleAuth');
const github = require('../helpers/githubAuth');

const router = new express.Router();

// This middleware prevents brute force attacks to guess password for the login endpoint
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
});

router.get('/logIn', csurfProtection, (req, res) => {
    const token = req.csrfToken();

    res.render('logIn', {
        googleUrl: google.url,
        githubUrl: github.url,
        formData: {},
        error: {},
        csurfToken: token,
        title: 'Sign In',
    });
});

router.post('/logIn', csurfProtection, limiter, (req, res) => {
    const { body } = req;
    const token = req.csrfToken();

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
                        userName: 'User does not exist, please sign up!',
                    },
                    csurfToken: token,
                    title: 'Sign In',
                });

            user = foundUser;
            if (!bcrypt.compareSync(body.password, user.password)) {
                return res.status(401).render('logIn', {
                    googleUrl: google.url,
                    githubUrl: github.url,
                    formData: req.body,
                    error: {
                        password: 'Invalid password',
                    },
                    csurfToken: token,
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

// After users enter their google credentials, they are redirected to this path by google with an authorization code
router.get('/auth/google/callback', (req, res) => {
    const { code } = req.query;

    if (code) {
        google
            .getAuthorizationToken(code)
            .then((tokens) => google.verifyIdentity(tokens.id_token))
            .then((loginTicket) => {
                const payload = loginTicket.getPayload();

                User.findOne({ userName: payload.email }).then((user) => {
                    const foundUser = user;

                    if (!foundUser) {
                        const newUser = {
                            userName: payload.email,
                            password: 'thirdparty',
                            thirdParty: true,
                            googleId: payload.sub,
                        };

                        new User(newUser).save((err) => {
                            if (err) return console.error(err);
                            req.session.user = newUser;
                            return res.redirect('/users/me');
                        });
                    } else if (!foundUser.googleId) {
                        foundUser.googleId = payload.sub;
                        foundUser.save((err) => {
                            if (err) throw err;
                            req.session.user = foundUser;
                            res.redirect('/users/me');
                        });
                    } else if (foundUser.googleId === payload.sub) {
                        req.session.user = foundUser;
                        res.redirect('/users/me');
                    } else {
                        res.status(401).send({ message: 'Invalid google account id!' });
                    }
                });
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send(e);
            });
    }
});

// After users enter their github credentials, they are redirected to this path by github with an authorization code
router.get('/auth/github/callback', (req, res) => {
    const { code } = req.query;

    if (code) {
        github
            .getAuthorizationToken(code)
            .then((token) => github.getUserData(token))
            .then((data) => {
                const id = data.id.toString();

                User.findOne({ userName: data.email }).then((user) => {
                    const foundUser = user;
                    if (!foundUser) {
                        const newUser = {
                            userName: data.email,
                            password: 'thirdparty',
                            thirdParty: true,
                            githubId: id,
                        };

                        new User(newUser).save((err) => {
                            if (err) return console.error(err);
                            req.session.user = newUser;
                            return res.redirect('/users/me');
                        });
                    } else if (!foundUser.githubId) {
                        foundUser.githubId = id;
                        foundUser.save((err) => {
                            if (err) throw err;
                            req.session.user = foundUser;
                            res.redirect('/users/me');
                        });
                    } else if (foundUser.githubId === id) {
                        req.session.user = foundUser;
                        res.redirect('/users/me');
                    } else {
                        res.status(401).send({ message: 'Invalid github account id!' });
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
    if (!req.session.user) {
        return res.status(401).send({ message: 'You are not authorized to use this route!' });
    }
    req.session.destroy();
    return res.redirect('/');
});

router.get('/signUp', csurfProtection, (req, res) => {
    res.render('signUp', {
        googleUrl: google.url,
        githubUrl: github.url,
        formData: {},
        error: {},
        csurfToken: req.csrfToken(),
        title: 'Sign up',
    });
});

router.post('/signUp', csurfProtection, (req, res) => {
    const { body } = req;
    const token = req.csrfToken();

    User.findOne({ userName: body.userName })
        .then((user) => {
            if (user)
                return res.status(400).render('signUp', {
                    googleUrl: google.url,
                    githubUrl: github.url,
                    csurfToken: token,
                    formData: req.body,
                    error: {
                        message: 'User already exists, please log in!',
                    },
                    title: 'Sign Up',
                });

            return new User(req.body).save().then((savedUser) => {
                req.session.user = savedUser;
                return res.redirect('/users/me');
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
        userName: user.userName.split('@')[0],
        title: 'Dashboard',
    });
});

module.exports = router;
