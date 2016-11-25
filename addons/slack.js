const fetch = require('node-fetch');

const SlackInterface = (webhook_url, { username, channel }) => ({
    post: text => {
        fetch(webhook_url, {
            method: 'POST',
            'Content-type': 'application/json',
            body: {
                username: username || 'Deployr',
                channel,
                text,
            },
        }).catch(e => {
            console.error(e);
        });
    }
});
