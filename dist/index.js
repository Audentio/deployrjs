function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chalk = require('chalk');
var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var git = require('git-promise');

var Deployr = function Deployr() {
    var _this = this;

    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Deployr);

    this.listen = function (callback) {
        // Create express server
        var app = express();

        // parse JSON
        // (Github web hooks send JSON)
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        // handle POST requests
        app.post('*', function (req, res) {
            if (_this.key) {
                // Verify SHA1 encrypted secret key
                // This is to make sure no one can send a bogus requests
                var hmac = crypto.createHmac('sha1', _this.key);
                hmac.update(JSON.stringify(req.body));
                var sig = 'sha1=' + hmac.digest('hex');

                // Key mismatch
                // Likely bogus request. stop executing
                if (req.headers['x-hub-signature'] !== sig) {
                    _this.log(chalk.red.bold('Github secret key verificiation failed!'));
                    return;
                }
            }

            // We're good to go
            console.log(chalk.gray('-----------------------------------'));
            _this.log(chalk.yellow.bold('✨  Starting deployment...'));

            callback(req, _this.pull);

            res.send('deploying');
        });

        app.listen(_this.port, function (err) {
            if (err) {
                console.error(err);
                return;
            }

            _this.log('🌐  Listening on port ' + _this.port);
        });
    };

    this.pull = function () {
        return new Promise(function (resolve, reject) {
            _this.log('Git: start');

            git('reset --hard').then(function () {
                return git('pull');
            }).then(function () {
                _this.log('Git: finished');
                resolve();
            }).fail(function (err) {
                console.log(err.stdout);
                reject(err);
            });
        });
    };

    this.log = function (message) {
        console.log(chalk.gray('[deployr] ') + message);
    };

    var _config$key = config.key;
    var key = _config$key === undefined ? null : _config$key;
    var _config$port = config.port;
    var port = _config$port === undefined ? 4000 : _config$port;


    this.key = key;
    this.port = port;
}

// Get latest from github
// This also runs `git reset --hard`
// to make sure we're identical to github repo
;

module.exports = Deployr;
