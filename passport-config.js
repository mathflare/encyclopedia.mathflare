const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
            const user = await User.findOne({ email: email });
            if (!user) return done(null, false, { message: 'The email or password is incorrect.' });
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) return done(null, user);
            else return done(null, false, { message: 'The email or password is incorrect.' });
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}