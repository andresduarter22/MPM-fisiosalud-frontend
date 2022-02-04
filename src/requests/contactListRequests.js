import requester from "../apiRequester/Requester.js"

async function getContactList() {
    // GET contact list
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('contactList', requestOptions);
};

const exports = {
    getContactList,
};
export default exports;
