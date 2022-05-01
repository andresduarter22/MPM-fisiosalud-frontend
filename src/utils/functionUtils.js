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

const hourPRAM = (hour) => {
    const today = hour.split(':');
    const hh = today[0];
    const mm = today[1];
    const aaa = hh >= 12 ? 'PM' : 'AM';
    return `${hh}:${mm}:00`;
};

const calculateEndHour = (startHour, durationMin) => {
    // console.log(startHour);
    // console.log(durationMin)
    // const startHourReplaced = startHour.replace(':', ' ');
    // const startHourSplit = startHourReplaced.split(' ');
    // const startHourHour = parseInt(startHourSplit[0]);
    // const startHourMin = parseInt(startHourSplit[1]);
    // const startHourTotalMinutes = (startHourHour * 60) + startHourMin;
    // const endHourTotalMinutes = startHourTotalMinutes + durationMin;
    // let endHourHour = startHourHour + Math.floor(durationMin / 60);
    // const endHourMin = endHourTotalMinutes % 60;
    // if (startHourMin > endHourMin && startHourHour <= 22) {
    //     endHourHour += 1;
    // } else if (startHourMin > endHourMin && startHourHour === 23) {
    //     endHourHour = 0;
    // }
    // const endHour = `${endHourHour}:${endHourMin}`;
    let end = new Date(startHour);
    console.log("utils: ", startHour)
    end.setMinutes(end.getMinutes() + durationMin);
    return `${end.toISOString()}`;
};

const generateTherapyList = (startDate, therapyAmount, therapyBatches, workingAreaID, therapyTime="00:00:00", therapyDuration) => {
    const therapyList = [{
        date: startDate,
        area_id: workingAreaID,
        time: therapyTime,
    }];
    let currentDate = nextDate(new Date(startDate));
    const requestedDays = organizeTherapies(therapyBatches);
    while (therapyList.length < therapyAmount) {
        if (currentDate.getDay().toString() in requestedDays) {
            for (const time of requestedDays[currentDate.getDay().toString()]) {
                therapyList.push({
                    date: currentDate.toISOString().substring(0, 10),
                    area_id: workingAreaID,
                    time: time,
                    duration: therapyDuration
                });
            }
        }
        currentDate = nextDate(currentDate);
    }
    console.log(therapyList);
    return therapyList;
};

const organizeTherapies = (therapyBatches) => {
    const requestedDaysWithHours = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    }

    for (const therapyBatch of therapyBatches) {
        for (const day of therapyBatch.days) {
            if (day in requestedDaysWithHours) {
                requestedDaysWithHours[day].push(hourPRAM(therapyBatch.time));
            }
        }
    }
    for (const day in requestedDaysWithHours) {
        if (requestedDaysWithHours[day].length === 0) {
            delete requestedDaysWithHours[day];
        }
    }
    return requestedDaysWithHours;
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
