<img src="https://cloud.githubusercontent.com/assets/1689818/19042025/0c44ffea-89a8-11e6-96c4-86fed4be8cdf.png" width="300">

### What?
DeployrJS allows quickly bootstrapping a deployment server that listens to github web hooks
and does whatever you want whenever an action occurs. This includes system commands and/or arbitrary JS

### How?

**1. Install** `npm install --save deployrjs`

**2. take over the planet**
```javascript
const Deployr = require('deployrjs');
const exec = require('child-process-promise').exec;

const deployment = new Deployr({
    // this is your github secret key.
    // Not passing this will disable verification
    key: #####,

    // port to listen on
    port: 4000,

    // branch to deploy
    branch: 'master',
});

deployment.listen((action, pull) => {
    // "action" is the object sent by github web hook

    pull()
        .then(() => {
            // At this point, files are identical to git repo
            // Let's re-run a build script

            console.log('Running build script...');
            return exec('npm run build');
        })

        .catch(err =>
            console.error('failed!');
        );
});
```

use Promise wrappers for async functions.
e.g. https://www.npmjs.com/package/fs-promise
