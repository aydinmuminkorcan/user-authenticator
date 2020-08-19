const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');


const port = process.env.PORT || 3000;

require('./db/mongoose');
const User = require('./models/user');

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
app.use(session({ secret: 'top-secret-word' }))

app.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/users/me');
    }

    res.render('index', {
        title: 'Home',
        name: 'Mumin Korcan Aydin'
    });
});

app.get('/users/logIn', (req, res) => {
    res.render('logIn', {
        formData:{},
        error:{},
        title: 'Log In Page',
        name: 'Mumin Korcan Aydin'
    });
});


app.post('/users/logIn', (req, res) => {
    const body = req.body;
    User.findOne({
        userName: body.userName
    }).then(user => {
        if (!user) 
            return res.status(400).render('logIn', {
                formData: req.body,
                error: {
                    message: 'User does not exist, please sign up!'
                },
                title: 'Log in Page',
                name: 'Mumin Korcan Aydin'
            });
        
        if (user.password !== body.password) 
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

app.get('/users/logOut', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


app.get('/users/signUp', (req, res) => {
    res.render('signUp', {
        formData: {},
        error: {},
        title: 'Sign up Page',
        name: 'Mumin Korcan Aydin'
    });
});

app.post('/users/signUp', (req, res) => {
    const body = req.body;
    User.findOne({
        userName: body.userName
    }).then((user) => {
        if (user) 
            return res.status(400).render('signUp',{
                formData: req.body,
                error: { message: 'User already exists, please log in!'},
                title: 'Sign Up Page',
                name: 'Mumin Korcan Aydin'
            }); 
        
        return new User(req.body).save()
            .then(user => {
                req.session.user = user;
                res.redirect('/users/me');
            });
    })
    .catch(e => {
        console.error(e);
        res.status(500).send(e);
    });
});
    

app.get('/users/me', (req, res) => {
    if (!req.session.user) 
        return res.redirect('/users/login');
    
    res.render('user', {
        userName: req.session.user.userName,
        name: 'Mumin Korcan Aydin'
    });
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


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