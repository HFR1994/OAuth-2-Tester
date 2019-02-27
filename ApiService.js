let axios = require("axios");

class ApiService {

    constructor() {
        this.axiosClient = axios.default.create({});
    }

    // I perform a GET request with the given options.
    async get(options) {
        return await this.axiosClient.request({
            method: 'get',
            url: options.url,
            params: options.params,
            headers: Object.assign({}, this.axiosClient.headers, options.headers)
        }).then((response) => {
            return response.data;
        }).catch((err) => {
            console.log(err);
            return (this.normalizeError(err));
        });
    }
    // I perform a POST request with the given options.
    async post(options) {
        return await this.axiosClient.request({
            method: 'post',
            url: options.url,
            data: options.params,
            headers: Object.assign({}, this.axiosClient.headers, options.headers)
        }).then((response) => {
            return response.data;
        }).catch((err) => {
            console.log(err);
            return (this.normalizeError(err));
        });
    }

    normalizeError(error) {
        // NOTE: Since I'm not really dealing with a production API, this doesn't really
        // normalize anything (ie, this is not the focus of this demo).
        return ({
            id: '-1',
            code: 'UnknownError',
            message: error.data
        });
    }

}

exports.ApiService = ApiService;
