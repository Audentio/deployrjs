# Deployr
just spec at this point

### What?
deployr allows quickly bootstrapping a deployment server that listens to github web hooks
and does whatever you want whenever an action occurs. This includes system commands and/or arbitrary JS

*Requirements:* git, nodejs

### How?

**1. Install** `npm install --save git+ssh://git@github.com:Audentio/deployr.git`

**2. Create deployr instance**
```javascript
const Deployr = require('deployr');

const deployment = new Deployr({
    key: #####, // this is your github secret key
    port: 4000, // port to listen on
});
```

**3. take over the planet**
```javascript
const exec = require('child-process-promise').exec;

deployment.listen((action, pull) => {
    if (action.type !== 'push') return;

    pull()
        .then(() => {
            // At this point, files are identical to git repo
            // Let's re-run a build script

            console.log('Running build script...');
            return exec('npm run build');
        })

        .then(mySynchronousFunction)

        .catch(err =>
            console.error('failed!');
        );
});
```

use Promise wrappers for async functions.
e.g. https://www.npmjs.com/package/fs-promise
