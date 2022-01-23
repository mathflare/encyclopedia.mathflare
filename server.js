if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
require('./passport-config.js')(passport);
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const articleRouter = require('./routes/article');
const topicRouter = require('./routes/topic');
const linkRouter = require('./routes/link');
const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000,
        secure: false,
        httpOnly: true,
    },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/article', articleRouter);
app.use('/topic', topicRouter);
app.use('/link', linkRouter);

mongoose.connect(process.env.DB_URL, () => {
    console.log('Connected to DB');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}\nAccess it at http://localhost:${PORT}`);
});
