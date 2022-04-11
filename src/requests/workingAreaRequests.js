import requester from "../apiRequester/Requester.js"

async function getWorkingAreas() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('workingArea', requestOptions);
};

async function getWorkingArea(workingAreaID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${workingAreaID}`
    return (await requester.request('workingArea', requestOptions, options))[0]
};

async function insertWorkingArea(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('workingArea', requestOptions);
};

async function updateWorkingArea(requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
    };
    return await requester.request('workingArea', requestOptions);
};

async function deleteWorkingArea(requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await requester.request('workingArea', requestOptions);
};

const exports = {
    getWorkingAreas,
    getWorkingArea,
    insertWorkingArea,
    updateWorkingArea,
    deleteWorkingArea,
};
export default exports;
