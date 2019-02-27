let moment = require("moment");

class OAuth2 {

    constructor(){

        this.clientAuth ={
            "verifiedCEmail": true,
                "clientId": "100000002-TCdM7gkyR0btu6OkZCgF1G6Ee4vyBuqQLYyF4P4JWVfQn.oauth2user.aabo.tech",
                "cEmail": "backend@proindiemusic.mx",
                "fullName": "Backend Connector",
                "clientSecret": "U5MV4wuCfmQ4dQDxQyLRQpdYAUaN7Y",
                "redirect_uri": [
                "https://proindiemusic-backend.mybluemix.net"
            ],
                "status": "true",
                "oauth2": "ttps://proindiemusic-oauth.mybluemix.net/"
        };

        this.credentials = {
            access_token: null,
            profile: null,
            refresh_token: null,
            expires_in: null
        };
    }

    async onSetRequest(body) {
        await fetch(`${this.clientAuth.oauth2}/oauth2/token`, {
            method: "POST",
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(res => {
                status = res.status;
                return res.json();
            })
            .then(res => [status, res])
            .catch(error => error);
    }

    async onCheckRequest(token) {
        return await fetch(`${this.clientAuth.oauth2}/oauth2/user`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                status = res.status;
                return res.json();
            })
            .then(res => [status, res])
            .catch(error => error);
    }

    async getToken() {
        let parent = this;
        try {
            const {access_token, refresh_token, expires_in, profile} = parent.credentials;

            if (expires_in && access_token && refresh_token && profile) {
                const time = moment(expires_in);
                if (time.isAfter(moment())) {
                    return {
                        access_token,
                        profile: JSON.parse(profile)
                    };
                }
            }

            if (access_token) {

                return await parent.onCheckRequest(access_token).then(async function (valid) {

                    if (valid[0] === 200) {
                        return {
                            access_token,
                            profile: JSON.parse(profile)
                        };
                    } else if ((valid[0] === 400 || valid[0] === 401) && refresh_token) {
                        const body = {
                            refresh_token: refresh_token,
                            grant_type: "refresh_token",
                            client_id: parent.clientAuth.clientId,
                            client_secret: parent.clientAuth.clientSecret
                        };

                        const searchParams = Object.keys(body).map((key) => {
                            return encodeURIComponent(key) + '=' + encodeURIComponent(body[key]);
                        }).join('&');

                        return await parent.onSetRequest(searchParams).then(function (valid) {

                            if (valid[0] === 200) {
                                parent.credentials["access_token"] = valid[1]["access_token"];

                                return {
                                    access_token: valid[1]["access_token"],
                                    profile: JSON.parse(parent.credentials["profile"])
                                };
                            } else {
                                parent.clear();
                                return {
                                    access_token: null,
                                    profile: null
                                };
                            }
                        }).catch((err) => {
                            parent.clear();
                            return {
                                access_token: null,
                                profile: null
                            };
                        });
                    }
                }).catch((err) => {
                    parent.clear();
                    return {
                        access_token: null,
                        profile: null
                    };
                });
            } else {
                parent.clear();
                return {
                    access_token: null,
                    profile: null
                };
            }

        } catch (err) {
            this.clearToken();
            return {
                access_token: null,
                profile: null
            };
        }
    };

    clearToken() {
        this.credentials = {
            access_token: null,
            profile: null,
            refresh_token: null,
            expires_in: null
        };
    };
}

exports.OAuth2 = OAuth2;
