import requester from "../apiRequester/Requester.js"

async function getContactList() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('contactList', requestOptions);
};

async function insertContact(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('contactList', requestOptions);
}

async function deleteContact(bodyValue) {
    const requestBody = {
        'filter': {
            '_id': bodyValue,
        }
    }
    const requestOptions = {
        method: 'DELETE',
        body: JSON.stringify(requestBody)
    };
    return await requester.request('contactList', requestOptions);
}

const exports = {
    getContactList,
    insertContact,
    deleteContact,
};
export default exports;
