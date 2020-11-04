const express = require('express');
//const router = express.Router();
const path = require('path');
const {MongoClient} = require('mongodb');
const expressEjsLayout = require('express-ejs-layouts');
const app = express();

const profileRoutes = require('./src/routes/profiles');
const dashboardRoutes = require('./src/routes/dashboard');
const notesRoutes = require('./src/routes/notes');
const indexRoutes = require('./src/routes/index');
const authRoutes = require('./src/routes/auth');

app.use(express.static(path.join(__dirname, 'src')));
app.set('views', path.join(__dirname, '/src/views'));

app.set('view engine', 'ejs');
app.use(expressEjsLayout);
app.use(express.urlencoded({extended : false}));

app.use('/', indexRoutes);
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/dashboard/notes', notesRoutes);

module.exports = app;