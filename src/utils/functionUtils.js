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
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

const getCurrentHour = () => {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, '0');
    const mm = String(today.getMinutes()).padStart(2, '0');
    const aaa = today.getHours() >= 12 ? 'PM' : 'AM';
    return `${hh}:${mm} ${aaa}`;
};

const calculateEndHour = (startHour, durationMin) => {
    const startHourReplaced = startHour.replace(':', ' ');
    const startHourSplit = startHourReplaced.split(' ');
    const startHourHour = parseInt(startHourSplit[0]);
    const startHourMin = parseInt(startHourSplit[1]);
    const startHourAMPM = startHourSplit[2];
    const startHourTotalMinutes = (startHourHour * 60) + startHourMin;
    const endHourTotalMinutes = startHourTotalMinutes + durationMin;
    let endHourHour = startHourHour + Math.floor(durationMin / 60);
    const endHourMin = endHourTotalMinutes % 60;
    if (startHourMin > endHourMin && startHourHour <= 22) {
        endHourHour += 1;
    } else if (startHourMin > endHourMin && startHourHour === 23) {
        endHourHour = 0;
    }
    const endHour = `${endHourHour}:${endHourMin}`;
    let endHourAMPM = startHourAMPM
    if (endHourHour > 12) {
        endHourAMPM = 'PM';
    } else if (endHourHour === 12) {
        endHourAMPM = 'PM';
    } else if (endHourHour === 0) {
        endHourAMPM = 'AM';
    }
    return `${endHour} ${endHourAMPM}`;
};
const generateTherapyList = (startDate, therapyAmount, dayNamesList, workingAreaID) => {
    const therapyList = [{
        date: startDate,
        area_id: workingAreaID,
    }];
    let currentDate = new Date(startDate);
    while (therapyList.length < therapyAmount) {
        currentDate = nextDate(currentDate);
        if (dayNamesList.includes(currentDate.getDay().toString())) {
            const temp = {
                date: currentDate.toISOString().substring(0, 10),
                area_id: workingAreaID,
            };
            therapyList.push(temp);
        }
    }

    return therapyList;
}

const nextDate = (date) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
}

const exports = {
    handleSetInput,
    sleep,
    getToday,
    getCurrentHour,
    calculateEndHour,
    generateTherapyList,
};

export default exports;
