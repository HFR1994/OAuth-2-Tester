let express = require('express');
let router = express.Router();
var uuid = require("uuid");

/* GET users listing. */
router.get('/add', function (req, res, next) {

    const email = req.query.email;
    const password = req.query.password;
    const name = req.query.name;
    const picture = req.query.picture;
    const locale = req.query.locale;
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    const apiService = req.app.locals.apiService;

    const body = {
        email: email,
        password: password,
        name: name,
        picture: picture,
        locale: locale,
        firstName: firstName,
        lastName: lastName
    };

    const searchParams = Object.keys(body).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
    }).join('&');

    let datos = apiService.post({
        url: `https://proindiemusic-oauth.mybluemix.net/oauth2/user`,
        params: searchParams,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((respuesta) => {
        res.json(respuesta);
    });

});

/* POST users login */
router.post('/login', function (req, res, next) {

    const apiService = req.app.locals.apiService;
    const oauth = req.app.locals.oauth2;
    const email = req.body.email;
    const password = req.body.password;

    let body = {
        redirect_uri: oauth.clientAuth.redirect_uri[0],
        client_id: oauth.clientAuth.clientId,
        state: uuid.v4(),
        email: email,
        password: password
    };

    const searchParams = Object.keys(body).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
    }).join('&');

    let datos = apiService.post({
        url: `https://proindiemusic-oauth.mybluemix.net/oauth2/auth`,
        params: searchParams,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then((respuesta) => {

        console.log(respuesta);

        body = {
            code: respuesta.payload.code,
            grant_type: "authorization_code",
            redirect_uri: oauth.clientAuth.redirect_uri[0],
            client_id: oauth.clientAuth.clientId,
            client_secret: oauth.clientAuth.clientSecret
        };

        const searchParams = Object.keys(body).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
        }).join('&');

        datos = apiService.post({
            url: `https://proindiemusic-oauth.mybluemix.net/oauth2/token`,
            params: searchParams,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then((respuesta) => {
            oauth.credentials = respuesta;
            res.json(respuesta);
        });
    });
});

/* POST users login */
router.post('/resetToken', function (req, res, next) {

    const apiService = req.app.locals.apiService;
    const oauth = req.app.locals.oauth2;

    let body = {
        refresh_token: oauth.credentials.refresh_token,
        client_id: oauth.clientAuth.clientId,
        client_secret: oauth.clientAuth.clientSecret,
        grant_type: "refresh_token"
    };

    const searchParams = Object.keys(body).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
    }).join('&');

    let datos = apiService.post({
        url: `https://proindiemusic-oauth.mybluemix.net/oauth2/token`,
        params: searchParams,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then((respuesta) => {
        oauth.credentials = respuesta;
        res.json(respuesta);
    });
});

/* GET users listing. */
router.post('/get', async function (req, res, next) {

    const apiService = req.app.locals.apiService;
    const oauth = req.app.locals.oauth2;

    let datos = apiService.get({
        url: `https://proindiemusic-oauth.mybluemix.net/oauth2/user`,
        params: {},
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + oauth.credentials.access_token
        }
    }).then((respuesta) => {
        res.json(respuesta);
    });

});

module.exports = router;
