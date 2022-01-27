import fetch from "node-fetch";

async function getContactList() {
    // GET contact list
    const requestOptions = {
        method: 'GET'
    };
    const response = await fetch('http://127.0.0.1:5000/api/v1/contactList', requestOptions);
    const data = await response.json();
    return data
};

const exports = {
    getContactList,
};
export default exports;
