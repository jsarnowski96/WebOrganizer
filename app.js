const express = require('express');

const app = express();

const profileRoutes = require('./src/routes/profile');
const dashboardRoutes = require('./src/routes/dashboard');
const notesRoutes = require('./src/routes/notes');

app.use('/profile', profileRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/dashboard/notes', notesRoutes);

module.exports = app;