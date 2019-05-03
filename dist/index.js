function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chalk = require('chalk');
var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var exec = require('child-process-promise').exec;

var Deployr = function Deployr() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Deployr);

    this.listen = function (callback) {
        // Create express server
        var app = express();

        // parse JSON
        // (Github web hooks send JSON)
        app.use(bodyParser.urlencoded({ limit: _this.memoryLimit, extended: true }));
        app.use(bodyParser.json({ limit: _this.memoryLimit }));

        // handle POST requests
        app.post('*', function (req, res) {
            var action = req.body;

            // check branch
            if (_this.branch && action.ref !== 'refs/heads/' + _this.branch) return;

            // check if commits were made
            if (_this.checkCommits && (!action.commits || !action.commits.length)) return;

            // key verification
            if (_this.key) {
                // Verify SHA1 encrypted secret key
                // This is to make sure no one can send a bogus requests
                var hmac = crypto.createHmac('sha1', _this.key);
                hmac.update(JSON.stringify(req.body));
                var sig = 'sha1=' + hmac.digest('hex');

                // Key mismatch
                // bogus request. stop executing
                if (req.headers['x-hub-signature'] !== sig) {
                    _this.log(chalk.red.bold('Github secret key verificiation failed!'));
                    return;
                }
            }

            // We're good to go
            console.log(chalk.gray('-----------------------------------'));
            _this.log(chalk.yellow.bold('✨  Starting deployment...'));

            callback(req.body, _this.pull);

            res.send('deploying');
        });

        app.listen(_this.port, function (err) {
            if (err) {
                console.error(err);
                return;
            }

            _this.log('\uD83C\uDF10  Listening on port ' + _this.port);
        });
    };

    this.pull = function () {
        return new Promise(function (resolve, reject) {
            _this.log('Git: start');

            exec('git reset --hard').then(function () {
                return exec('git pull');
            }).then(function () {
                _this.log('Git: finished');
                resolve();
            }).catch(function (err) {
                console.log(err.stdout);
                reject(err);
            });
        });
    };

    this.log = function (message) {
        console.log(chalk.gray('[deployr] ') + message);
    };

    var _config$key = config.key,
        key = _config$key === undefined ? null : _config$key,
        _config$port = config.port,
        port = _config$port === undefined ? 4000 : _config$port,
        _config$memoryLimit = config.memoryLimit,
        memoryLimit = _config$memoryLimit === undefined ? '10mb' : _config$memoryLimit,
        branch = config.branch,
        _config$checkCommits = config.checkCommits,
        checkCommits = _config$checkCommits === undefined ? true : _config$checkCommits;


    this.key = key;
    this.port = port;
    this.memoryLimit = memoryLimit;
    this.branch = branch;
    this.checkCommits = checkCommits;
}

// Get latest from github
// This also runs `git reset --hard`
// to make sure we're identical to github repo
;

module.exports = Deployr;
