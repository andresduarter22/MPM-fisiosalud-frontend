import requester from "../apiRequester/Requester.js"

async function getContactList() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('contactList', requestOptions);
};

async function getContact(contactID) {
    const requestOptions = {
        method: 'GET'
    };
    const options = `id=${contactID}`
    return requester.request('contactList', requestOptions, options);
};

async function insertContact(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('contactList', requestOptions);
};

async function updateContact(bodyValue) {
    const requestBody = bodyValue
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(requestBody)
    };
    return await requester.request('contactList', requestOptions);
};

async function deleteContact(requestBody) {
    const requestOptions = {
        method: 'DELETE',
        body: requestBody
    };
    return await requester.request('contactList', requestOptions);
};

const exports = {
    getContactList,
    getContact,
    insertContact,
    updateContact,
    deleteContact,
};
export default exports;
