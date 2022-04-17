import requester from "../apiRequester/Requester.js"

async function getPatientsList() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('patient', requestOptions);
};

async function getPatient(patientID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${patientID}`
    return (await requester.request('patient', requestOptions, options))[0]
};

async function insertPatient(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('patient', requestOptions);
}

async function updatePatient(requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
    };
    return await requester.request('patient', requestOptions);
}

async function deletePatient(requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await requester.request('patient', requestOptions);
}

const exports = {
    getPatientsList,
    getPatient,
    insertPatient,
    updatePatient,
    deletePatient,
};
export default exports;
