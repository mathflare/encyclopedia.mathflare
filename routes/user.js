const express = require('express');
const User = require('../models/User');
const Article = require('../models/Article');
const router = express.Router();
router.use(express.static('public'));
const { ensureAuthenticated } = require('../ensureAuthenticated');
const { collection } = require('../models/User');

router.get('/edit', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        res.render('edit-account', {
            docTitle: 'Edit Account',
            isLoggedIn: req.isAuthenticated(),
            username: req.isAuthenticated() ? req.user.username : '',
            avatar: req.isAuthenticated() ? req.user.avatar : '',
            name: user.name,
            bio: user.bio,
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/update', ensureAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name: req.body.name,
            bio: req.body.bio,
            avatar: `${req.body.avatar}.png`,
        });
        res.redirect(`/user/${req.user.username}`);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const articles = await Article.find({ contibutors: { _id: user._id } });
            res.render('user', {
                docTitle: `User ${req.params.username}`,
                userName: user.username,
                name: user.name,
                joined: user.created_at,
                bio: user.bio,
                avatar: user.avatar,
                articles,
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                isAccountOwner: req.isAuthenticated() && req.user.username === username,
            });
        } else {
            res.status(404).render('errors/no-user', {
                docTitle: '404 User not found',
                username: username,
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
            });
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;