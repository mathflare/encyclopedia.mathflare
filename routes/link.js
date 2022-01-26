const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
router.use(express.static('public'));

router.get('/', async (req, res) => {
    const topics = await Topic.find({});
    res.render('errors/ext-link', {
        docTitle: 'Attention',
        url: decodeURI(req.query.url),
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
        topics,
    });
});

module.exports = router;