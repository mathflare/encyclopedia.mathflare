const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../ensureAuthenticated');
router.use(express.static('public'));
const Article = require('../models/Article');

router.get('/new', ensureAuthenticated, (req, res) => {
    res.render('new-article', {
        docTitle: 'New Article',
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
    });
});

router.get('/:title', async (req, res) => {
    try {
        const article = await Article.findOne({ title: req.params.title })
        if (article) {
            res.render('article', {
                docTitle: req.params.title,
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                article
            });
        } else {
            res.status(404).render('errors/no-article', {
                docTitle: '404 Article not found',
                isLoggedIn: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username : '',
                title: req.params.title,
            });
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/new', ensureAuthenticated, async (req, res) => {
    console.log('new article');
    //todo: validation
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        contributors: [{ _id: req.user._id, username: req.user.username, name: req.user.name }],
    });
    try {
        console.log('saving article');
        await article.save();
    } catch (error) {
        //todo: render error page
        console.log(error);
    }
});

module.exports = router;