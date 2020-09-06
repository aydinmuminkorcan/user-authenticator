const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 3000;

require('./db/mongoose');
const userRouter = require('./routers/userRouter');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'top-secret-word',
    cookie: {
        maxAge: 60000
    }
}))

app.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/users/me');
    }

    res.render('index', {
        title: 'Home',
        name: 'Mumin Korcan Aydin'
    });
});

app.use('/users', userRouter);

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mumin Korcan Aydin',
        errorMessage: 'Page not found.'
    });
});


app.listen(port, () => {
    console.log('Server is up on port 3000.')
});