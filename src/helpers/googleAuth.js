const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const googleClientId = process.env.GOOGLE_CLIENT_ID;

// Create connection to google apis with our credentials
const connection = new google.auth.OAuth2(
    googleClientId,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

const authClient = new OAuth2Client(googleClientId);

const scope = ['openid', 'email']; // For now we only need to access the user's email address for authentication

// Generates URL for consent page landing (Where users enter their google credentials)
const url = connection.generateAuthUrl({
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: scope.join(' '),
});

// This function obtains the access token for accessing google resources of a user on behalf of them and the id token
// containing the user's approved login information signed by google which we will use it for our authentication process.
// We could get some google profile information of the user by the access token to authenticate user, but the main purpose
// of Oauth 2.0 protocol is authorization, not authentication. For authentication, OpenID protocol is implemented on the top
// of Oauth 2.0. Since google has already implemented this protocol, the provide id_token for this context.

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
