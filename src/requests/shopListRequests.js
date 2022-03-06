import requester from "../apiRequester/Requester.js"

async function getShopItemsList() {
    const requestOptions = {
        method: 'GET'
    };
    return await requester.request('shopArticle', requestOptions);
};

async function insertShopItem(bodyValue) {
    const requestOptions = {
        method: 'POST',
        body: bodyValue
    };
    return await requester.request('shopArticle', requestOptions);
}

async function updateShopItem(shopItemID, bodyValue) {
    const requestBody = {
        'filter': {
            '_id': shopItemID,
        },
        'body': {
            bodyValue
        }
    }
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(requestBody)
    };
    return await requester.request('shopArticle', requestOptions);
}

async function deleteShopItem(bodyValue) {
    const requestBody = {
        'filter': {
            '_id': bodyValue,
        }
    }
    const requestOptions = {
        method: 'DELETE',
        body: JSON.stringify(requestBody)
    };
    return await requester.request('shopArticle', requestOptions);
}

const exports = {
    getShopItemsList,
    insertShopItem,
    updateShopItem,
    deleteShopItem,
};
export default exports;
