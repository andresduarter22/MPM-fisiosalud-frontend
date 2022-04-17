function handleSetInput(handlerFunction) {
    return (event) => {
        handlerFunction(event.target.value);
    };
};

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const getToday = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

const exports = {
    handleSetInput,
    sleep,
    getToday,
};

export default exports;
