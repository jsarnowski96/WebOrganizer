const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
require('./src/config/passport')(passport);
const session = require('express-session');
const flash = require('connect-flash');
const expressEjsLayout = require('express-ejs-layouts');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

mongoose.connect('mongodb+srv://'+process.env.DB_USERNAME+':'+process.env.DB_PASSWORD+'@'+process.env.DB_URL+'/'+process.env.DB_NAME+'?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('ATLAS - Connected'))
.catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.use(express.urlencoded({extended : false}));

// Basic key routes
const indexRoutes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');
const dashboardRoutes = require('./src/routes/dashboard');
const { waitForDebugger } = require('inspector');
const { render } = require('ejs');
const { profile } = require('console');

app.use(express.static(path.join(__dirname, 'src')));
app.set('views', path.join(__dirname, '/src/views'));

app.use(session({
    secret: "weborg",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
next();
})

// Routing & redirections
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.all('*', (req, res, next) => {
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' - Bad Request of url ' + req.url);
    if(!req.isAuthenticated()) {
        res.status(400).redirect('/');
    } else {
        res.status(400).redirect('/dashboard');
    }
    throw new Error("Bad Request");
})

module.exports = app;