"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");

const expressBrute = require("express-brute");
const store = new expressBrute.MemoryStore();
const bruteForce = new expressBrute(store);

const User = require("../models/user");
const router = new express.Router();

const google = require("../helpers/googleAuth");

router.get("/", (req, res) => {
	User.find({})
		.then(users => {
			res.send(users);
		})
		.catch(e => {
			res.status(400).send(e);
		});
});

router.get("/logIn", (req, res) => {
	res.render("logIn", {
		url: google.url,
		formData: {},
		error: {},
		title: "Sign In",
	});
});

router.post("/logIn", bruteForce.prevent, (req, res) => {
	const body = req.body;

	var user = null;

	User.findOne({
		userName: body.userName,
		thirdParty: false,
	})
		.then(foundUser => {
			if (!foundUser)
				return res.status(401).render("logIn", {
					url: google.url,
					formData: req.body,
					error: {
						message: "User does not exist, please sign up!",
					},
					title: "Sign In",
				});

			user = foundUser;
			if (!bcrypt.compareSync(body.password, user.password)) {
				return res.status(401).render("logIn", {
					url: google.url,
					formData: req.body,
					error: {
						message: "Invalid password",
					},
					title: "Sign In",
				});
			}

			req.session.user = user; // Save user in the session object to use in the subsequent requests
			res.redirect("/users/me");
		})
		.catch(e => {
			console.error(e);
			res.status(500).send(e);
		});
});

router.get("/auth/google/callback", (req, res) => {
	const code = req.query.code;

	if (code) {
		google
			.getAuthorizationToken(code)
			.then(function (tokens) {
				return google.verifyIdentity(tokens.id_token);
			})
			.then(loginTicket => {
				const payload = loginTicket.getPayload();

				User.findOne({ userName: payload.email }).then(foundUser => {
					if (!foundUser) {
						const user = {
							userName: payload.email,
							password: "thirdparty",
							age: 99,
							thirdParty: true,
						};

						new User(user).save(function (err) {
							if (err) return console.error(err);
							req.session.user = user;
							res.redirect("/users/me");
						});
					} else {
						req.session.user = foundUser;
						res.redirect("/users/me");
					}
				});
			})
			.catch(e => {
				console.error(e);
				res.status(500).send(e);
			});
	}
});

router.get("/logOut", (req, res) => {
	req.session.destroy();
	res.redirect("/");
});

router.get("/signUp", (req, res) => {
	res.render("signUp", {
		url: google.url,
		formData: {},
		error: {},
		title: "Sign up",
	});
});

router.post("/signUp", (req, res) => {
	const body = req.body;

	User.findOne({
		userName: body.userName,
	})
		.then(user => {
			if (user)
				return res.status(400).render("signUp", {
					formData: req.body,
					error: {
						message: "User already exists, please log in!",
					},
					title: "Sign Up",
				});

			return new User(req.body)
				.save()
				.then(user => {
					req.session.user = user;
					return res.redirect("/users/me");
				})
				.catch(e => {
					res.status(400).render("signUp", {
						formData: req.body,
						error: {
							message: e.message,
						},
						title: "Sign Up",
					});
				});
		})
		.catch(e => {
			console.error(e);
			res.status(500).send(e);
		});
});

router.get("/me", (req, res) => {
	if (!req.session.user) return res.redirect("/users/login");

	const user = req.session.user;

	res.render("dashboard", {
		userName: user.userName,
		title: "Dashboard",
	});
});

module.exports = router;
