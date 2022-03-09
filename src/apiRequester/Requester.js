import fetch from "node-fetch";
import env from "../config/env.js"

async function request(endpoint, requestOptions, options = '') {
    let url = `${env.host}${endpoint}`
    if (options !== '') {
        url = `${env.host}${endpoint}?${options}`
    }
    const response = await fetch(url, requestOptions);
    return response.json();
};

const exports = {
    request,
};
export default exports;
