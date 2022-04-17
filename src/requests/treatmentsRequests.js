import requester from "../apiRequester/Requester.js"

async function getTreatmentsList() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('treatment', requestOptions);
};

async function getTreatment(treatmentID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${treatmentID}`
    return (await requester.request('treatment', requestOptions, options))[0]
};

async function insertTreatment(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('treatment', requestOptions);
};

async function updateTreatment(requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
    };
    return await requester.request('treatment', requestOptions);
};

async function deleteTreatment(requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await requester.request('treatment', requestOptions);
};

const exports = {
    getTreatmentsList,
    getTreatment,
    insertTreatment,
    updateTreatment,
    deleteTreatment,
};
export default exports;
