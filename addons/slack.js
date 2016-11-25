const fetch = require('node-fetch');

const SlackInterface = (webhook_url, { username, channel } = {}) => ({
    post: text => {
        const body = {
            text,
            username: username || 'Deployr',
        };

        if (channel) body.channel = channel;

        fetch(webhook_url, {
            method: 'POST',
            body: JSON.stringify(body),
        })
        .then(response => response.text())
        .then(response => {
            console.log('SLACK:' + response);
        }).catch(e => {
            console.error('SLACK:' + e);
        });
    }
});

module.exports = SlackInterface;
