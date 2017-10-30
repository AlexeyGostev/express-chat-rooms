const express = require('express');
//const path = require('path');
const router = express.Router();
const passport = require('../auth/passport');

const log = require('../libs/log.js')(module);
const User = require('../models/user.js');

router.get('/:id?', 
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    if (!req.params.id) {
      User.getUsers()
        .then(users => {
          if (!users) {
            res.json({"error": "users not found"})
          } else {
            users = users.map((user) => {
              return {
                viewerId: user.viewerId,
                created: user.created
              }
            });
            res.json({
              "users": users
            });
          }
        })
        .catch(err => {
          log.error(err);
          next(500);
        })
    } else {
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
    }
});

router.post('/',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    let viewerId = req.body.viewerId + '';
    let authKey = req.body.authKey + '';

    User.register(viewerId, authKey)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        log.error(err.status);
        if (err.status === 400) {
          next(400);
        }
        else {
          next(500);
        }
      });
});
router.put('/',
  //passport.authenticate('bearer', { session: false }),
  (req, res) => {
    newUser = JSON.parse(req.body.data);
    log.info(JSON.parse(req.body.data));
    res.end();
  }

);

router.delete('/', function(req, res) {
});

module.exports = router;