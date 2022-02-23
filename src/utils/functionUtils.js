function handleSetInput(handlerFunction) {
    return (event) => {
        handlerFunction(event.target.value)
    };
};

const exports = {
    handleSetInput,
};
export default exports;
