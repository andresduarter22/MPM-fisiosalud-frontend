import fetch from "node-fetch";
import env from "../config/env.js"

async function request(endpoint, requestOptions) {
    const response = await fetch(`${env.host}${endpoint}`, requestOptions);
    return response.json();
};

const exports = {
    request,
};
export default exports;