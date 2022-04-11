import Requester from "../apiRequester/Requester.js"

async function getStaffList() {
    const requestOptions = {
        method: 'GET'
    };
    return await Requester.request('staff', requestOptions);
};

async function getStaff(staffID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${staffID}`
    return (await Requester.request('staff', requestOptions, options))[0]
};

async function insertStaff(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await Requester.request('staff', requestOptions);
};

async function updateStaff(requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
    };
    return await Requester.request('staff', requestOptions);
};

async function deleteStaff(requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await Requester.request('staff', requestOptions);
};

const exports = {
    getStaffList,
    getStaff,
    insertStaff,
    updateStaff,
    deleteStaff,
};
export default exports;
