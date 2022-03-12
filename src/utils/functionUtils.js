function handleSetInput(handlerFunction) {
    return (event) => {
        handlerFunction(event.target.value);
    };
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const exports = {
    handleSetInput,
    sleep,
};

export default exports;
