const express = require('express');
const router = express.Router();
router.use(express.static('public'));

router.get('/:topic', (req, res) => {
    res.render('topic', {
        docTitle: `Topic ${req.params.topic}`,
        topic: req.params.topic,
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
    });
});

module.exports = router;