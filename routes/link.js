const express = require('express');
const router = express.Router();
router.use(express.static('public'));

router.get('/', (req, res) => {
    res.render('errors/ext-link', {
        docTitle: 'Attention',
        url: decodeURI(req.query.url),
        isLoggedIn: req.isAuthenticated(),
        username: req.isAuthenticated() ? req.user.username : '',
    });
});

module.exports = router;