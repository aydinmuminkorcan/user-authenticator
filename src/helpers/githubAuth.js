const queryString = require('query-string');
const axios = require('axios');

const githubClientId = process.env.GITHUB_CLIENT_ID;

const params = queryString.stringify({
    client_id: githubClientId,
    redirect_uri: process.env.GITHUB_REDIRECT_URI,
    scope: ['user:email'].join(' '), // space separated string
    allow_signup: true,
});

const url = `https://github.com/login/oauth/authorize?${params}`;

function getAuthorizationToken(code) {
    return axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        data: {
            client_id: githubClientId,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
            code,
        },
        headers: {
            Accept: 'application/json',
        },
    }).then(({ data }) => {
        if (data.error) throw new Error(data.error_description);
        return data.access_token;
    });
}

function getUserData(token) {
    return axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: `token ${token}`,
        },
    }).then(({ data }) => data);
}

module.exports = {
    getAuthorizationToken,
    getUserData,
    url,
};
