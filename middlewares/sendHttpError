log = require('../libs/log.js')(module);

/*
    Этот мидлвэр вешает на объект res метод для обработки и отправки HttpError
 */

middleware = function(req, res, next) {
    res.sendHttpError = function(error) {
        res.status(error.status);
        res.json(error);
    };
    next();
};

module.exports = middleware;