import requester from "../apiRequester/Requester.js"

async function getTherapyList() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('therapy', requestOptions);
};

async function getTherapy(therapyID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${therapyID}`
    return (await requester.request('therapy', requestOptions, options))[0]
};

async function insertTherapy(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('therapy', requestOptions);
};

async function updateTherapy(requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
    };
    return await requester.request('therapy', requestOptions);
};

async function deleteTherapy(requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await requester.request('therapy', requestOptions);
};

const exports = {
    getTherapyList,
    getTherapy,
    insertTherapy,
    updateTherapy,
    deleteTherapy,
};
export default exports;