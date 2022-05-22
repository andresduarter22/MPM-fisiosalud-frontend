import fetch from "node-fetch";
import env from "../config/env.js"
import { getCookie, setCookie, removeCookie } from "../utils/cookiesManager.js";

async function request(endpoint, requestOptions, args = '') {
    let url = `${env.host}${endpoint}`
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${getCookie('access_token')}`);
    requestOptions.headers = headers;
    if (args !== '') {
        url = `${env.host}${endpoint}?${args}`
    }
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 403) {
        window.location.href = '/';
    } else if (response.status === 401) {
        const newResponse = await requestAccessCookieRefresh(url, requestOptions);
        return newResponse.json();
    }
};

async function requestLogin(username, password) {
    const bodyValue = {
        _id: username,
        password: password,
    }
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(bodyValue)
    }
    const url = `${env.host}authentication`
    const response = await fetch(url, requestOptions);
    return response;
};

async function requestAccessCookieRefresh(url, requestOptions) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${getCookie('refresh_token')}`);
    const authRequestOptions = {
        method: 'PUT',
        headers: headers
    }
    const authUrl = `${env.host}authentication`
    const response = await fetch(authUrl, authRequestOptions);
    if (response.status === 401) {
        removeCookie('access_token');
        removeCookie('refresh_token');
        window.location.href = '/';
    } else {
        const cookies = await response.json();
        setCookie('access_token', cookies.access_token);
        setCookie('refresh_token', cookies.refresh_token);
        requestOptions.headers.set('Authorization', `Bearer ${getCookie('access_token')}`);
        const savedResponse = await fetch(url, requestOptions);
        return savedResponse;
    }
};

async function requestGetList(endpoint) {
    const requestOptions = {
        method: 'GET'
    };
    return await request(endpoint, requestOptions);
};

async function requestGet(endpoint, ID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${ID}`
    return (await request(endpoint, requestOptions, options))[0]
};

async function requestInsert(endpoint, requestBody) {
    const requestOptions = {
        method: 'POST',
        body: requestBody
    };
    return await request(endpoint, requestOptions);
};

async function requestUpdate(endpoint, requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
    };
    return await request(endpoint, requestOptions);
};

async function requestDelete(endpoint, requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await request(endpoint, requestOptions);
};

const exports = {
    request,
    requestLogin,
    requestGetList,
    requestGet,
    requestInsert,
    requestUpdate,
    requestDelete,
};

export default exports;
