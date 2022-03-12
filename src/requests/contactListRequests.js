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
    return (await requester.request('contactList', requestOptions, options))[0]
};

async function insertContact(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('contactList', requestOptions);
};

async function updateContact(requestBody) {
    const requestOptions = {
        method: 'PUT',
        body: requestBody
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
