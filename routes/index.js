const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { ensureAuthenticated } = require('../ensureAuthenticated');
const router = express.Router();
router.use(express.static('public'));

router.get('/', (req, res) => {
    res.render('index', {
        docTitle: 'Home',
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
    });
});

router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup', {
            docTitle: 'Sign Up'
        });
    }
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login', {
            docTitle: 'Log In'
        });
    }
});

router.get('/search', (req, res) => {
    res.render('search', {
        docTitle: 'Search',
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
    });
});

router.post('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const results = await User.find({
            username: { $regex: query }
        });
        res.render('search', {
            docTitle: 'Search',
            isLoggedIn: req.isAuthenticated(),
            username: req.isAuthenticated() ? req.user.username : '',
            results: results,
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/signup', async (req, res) => {
    const { name, username, email, password, repeatPassword, profileColor } = req.body;
    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });
    let errors = [];

    if (!name || !username || !email || !password || !repeatPassword) {
        errors.push({ message: 'Please fill in all fields' });
    }

    if (email.length > 30 || username.length > 15 || name.length > 30 || password.length > 30) {
        errors.push({ message: 'Email, name, username or password is too long.' });
    }

    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        errors.push({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 8) {
        errors.push({ message: 'The password must be at least 8 characters long.' });
    }

    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$+%^&*-]).{8,}$/.test(password)) {
        errors.push({ message: 'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character(#?!@$+%^&*-).' });
    }

    if (password !== repeatPassword) {
        errors.push({ message: 'Passwords do not match' });
    }

    if (emailExist) {
        errors.push({ message: 'Email already exists' });
    }

    if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'administrator' || username.toLowerCase() === 'edit' || username.toLowerCase() === 'update') {
        errors.push({ message: 'Illegal username' });
    }

    if (usernameExist) {
        errors.push({ message: 'Username is taken' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            docTitle: 'Sign Up',
            errors,
            name,
            username,
            email,
            password,
            repeatPassword
        });
    } else {
        let avatarColor;
        if (profileColor === 'random') {
            const colors = ['black', 'blue', 'green', 'orange', 'violet', 'red'];
            avatarColor = colors[Math.floor(Math.random() * colors.length)];
        } else {
            avatarColor = profileColor;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            avatar: `${avatarColor}.png`
        });
        try {
            await user.save();
            req.flash('success_message', 'You are now registered. Please log in.');
            res.status(200).redirect('/login');
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', ensureAuthenticated, (req, res) => {
    if (req.user) {
        req.logout();
        req.flash('success_message', 'You have been logged out.');
        res.redirect('/login');
    } else {
        req.flash('error_message', 'You have to be logged in.');
        res.status(401).redirect('/login');
    }
});

module.exports = router;