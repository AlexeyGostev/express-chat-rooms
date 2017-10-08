const express = require('express');
//const path = require('path');
const router = express.Router();

const log = require('../libs/log.js')(module);
const User = require('../models/user.js').User;

router.get('/:id', function(req, res, next) {
    User.getUser(req.params.id)
        .then(user => {
            if (!user) {
                res.json({"error": "user not found"});
            } else {
                res.json({
                    "viewerId": user.viewerId,
                    "created": user.created
                });
            }
        })
        .catch(err => {
            log.error(err);
            next(500);
        });
});

router.post('/', (req, res) => {

});
router.put('/', (req, res) => {

});

router.delete('/', function(req, res) {
    res.render('index');
});

module.exports = router;