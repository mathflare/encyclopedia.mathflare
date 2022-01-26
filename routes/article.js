const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../ensureAuthenticated');
router.use(express.static(__dirname + '/public'));
const Article = require('../models/Article');
const Topic = require('../models/Topic');

router.get('/new', ensureAuthenticated, async (req, res) => {
    const topics = await Topic.find({});
    res.render('new-article', {
        docTitle: 'New Article',
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
        topics,
    });
});

router.get('/:title', async (req, res) => {
    try {
        const article = await Article.findOne({ title: req.params.title })
        if (article) {
            const topics = await Topic.find({});
            res.render('article', {
                docTitle: req.params.title,
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                article,
                topics,
            });
        } else {
            const topics = await Topic.find({});
            res.status(404).render('errors/no-article', {
                docTitle: '404 Article not found',
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                title: req.params.title,
                topics,
            });
        }
    } catch (err) {
        //todo: render error page
        console.log(err);
    }
});

router.get('/:title/edit', ensureAuthenticated, async (req, res) => {
    try {
        const article = await Article.findOne({ title: req.params.title })
        if (article) {
            const topics = await Topic.find({});
            res.render('edit-article', {
                docTitle: `Editing ${req.params.title}`,
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                article,
                topics,
            });
        } else {
            const topics = await Topic.find({});
            res.status(404).render('errors/no-article', {
                docTitle: '404 Article not found',
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                title: req.params.title,
                topics,
            });
        }
    } catch (err) {
        //todo: render error page
        console.log(err);
    }
});

router.post('/new', ensureAuthenticated, async (req, res) => {
    const topic = await Topic.findById(req.body.topic);
    if (topic) {
        const article = new Article({
            title: req.body.title.trim(),
            content: req.body.content,
            topic: topic._id,
            contributors: [{ _id: req.user._id, username: req.user.username, name: req.user.name }],
        });
        try {
            await article.save();
        } catch (error) {
            //todo: render error page
            console.log(error);
        }
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

router.post('/:title/update', ensureAuthenticated, async (req, res) => {
    //todo: validation
    const article = await Article.findOne({ title: req.params.title });
    if (article) {
        try {
            await Article.updateOne({ title: req.params.title }, {
                content: req.body.content,
                //if user is not in contributors array, add them
                contributors: article.contributors.includes(req.user._id) ? article.contributors : [...article.contributors, { _id: req.user._id, username: req.user.username, name: req.user.name }],
            });
        } catch (error) {
            //todo: render error page
            console.log(error);
        }
    } else {
        res.status(404).render('errors/no-article', {
            docTitle: '404 Article not found',
            isLoggedIn: req.isAuthenticated(),
            username: req.isAuthenticated() ? req.user.username : '',
            title: req.params.title,
        });
    }
});

module.exports = router;