const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const googleClientId = process.env.GOOGLE_CLIENT_ID;

const connection = new google.auth.OAuth2(
    googleClientId,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

const authClient = new OAuth2Client(googleClientId);

const scope = ['openid', 'email'];

const url = connection.generateAuthUrl({
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: scope.join(' '),
});

function getAuthorizationToken(authorizationCode) {
    return axios({
        method: 'post',
        url: 'https://oauth2.googleapis.com/token',
        data: {
            client_id: googleClientId,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
            code: authorizationCode,
        },
    }).then((res) => res.data);
}

function verifyIdentity(idToken) {
    return authClient.verifyIdToken({
        idToken,
        audience: googleClientId,
    });
}

module.exports = {
    getAuthorizationToken,
    verifyIdentity,
    url,
};
