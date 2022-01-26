const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
router.use(express.static('public'));

router.get('/:topic', async (req, res) => {
    const topic = await Topic.findOne({ title: req.params.topic });
    if (topic) {
        res.render('topic', {
            docTitle: `Topic ${req.params.topic}`,
            topic,
            isLoggedIn: req.isAuthenticated(),
            username: req.isAuthenticated() ? req.user.username : '',
            topics: await Topic.find({}),
        });
    } else {
        res.status(404).render('errors/no-topic', {
            docTitle: '404 Topic not found',
            isLoggedIn: req.isAuthenticated(),
            username: req.isAuthenticated() ? req.user.username : '',
            topic: req.params.topic,
            topics: await Topic.find({}),
        });
    }
});

module.exports = router;