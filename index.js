const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
require('./src/config/passport')(passport);
const session = require('express-session');
const flash = require('connect-flash');
const expressEjsLayout = require('express-ejs-layouts');
const app = express();

mongoose.connect('mongodb+srv://wo_tester:iGDJifg7vh8pHRSm@dev.bpq8s.mongodb.net/WebOrganizer?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected...'))
.catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.use(express.urlencoded({extended : false}));

const indexRoutes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');

app.use(express.static(path.join(__dirname, 'src')));
app.set('views', path.join(__dirname, '/src/views'));

app.use(session({
    secret: 'secret',
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
next();
})

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

module.exports = app;