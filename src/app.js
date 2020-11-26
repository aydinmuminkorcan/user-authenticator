const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const session = require("express-session");
const helmet = require("helmet");

const port = process.env.PORT;

require("./db/mongoose");

const userRouter = require("./routers/userRouter");

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

const sess = {
	secret: "top-secret-word",
	cookie: {
		httpOnly: true,
		maxAge: 60000,
	},
};

if (process.env.NODE_ENV == "production") {
	// Add some extra security http headers and cookie options for the production environment
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				"script-src": ["'self'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
				"frame-ancestors": ["'self'", "https://www.google.com"],
				"img-src" : ["'self'"]
			},
		})
	);

	app.set("trust proxy", 1);
	sess.cookie.secure = true;
}

app.use(session(sess));

app.use(bodyParser.json({ limit: "50kb" })); // limit the body size

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.get("/", (req, res) => {
	if (req.session.user) {
		return res.redirect("/users/me");
	}

	res.render("index", {
		title: "Home",
	});
});

app.use("/users", userRouter);

app.get("*", (req, res) => {
	res.render("404", {
		title: "404",
		errorMessage: "Page not found.",
	});
});

app.listen(port, () => {
	console.log("Server is up on port " + port);
});