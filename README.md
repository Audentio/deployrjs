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
    path: 'deploy', // listener's path (http://yoursite.com:PORT/deploy)
});
```

**3. take over the planet**
```javascript
deployment.listen()
    .then(action => {
        // At this point "git reset --hard" and "git pull" have finished executing
        // the folder now have
        if (action.type === 'push') {
            myBuildFunction();
        }
    })
    .then(anotherFunction)
    .then(() => {
        console.log('Woot!');
    });
```
