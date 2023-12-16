function handleSetInput(handlerFunction) {
    return (event) => {
        handlerFunction(event.target.value);
    };
};

const getDate = (date) => {
    const currentDate = new Date(date);
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const yyyy = currentDate.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
};

const getHour = (date) => {
    const hour = new Date(date);
    const hh = String(hour.getHours()).padStart(2, '0');
    const mm = String(hour.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}:00`;
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
    return `${hh}:${mm}:00`;
};

const hourPRAM = (hour) => {
    const today = hour.split(':');
    const hh = today[0];
    const mm = today[1];
    return `${hh}:${mm}:00`;
};

const calculateEndHour = (startHour, durationMin) => {
    let end = new Date(startHour);
    end.setMinutes(end.getMinutes() + durationMin);
    return end;
};

const generateTherapyList = (startDate, therapyAmount, therapyBatches, workingAreaID, therapyDuration, therapyTime="00:00:00" ) => {
    const therapyList = [{
        title: "THERAPY 1",
        date: startDate,
        area_id: workingAreaID,
        time: therapyTime,
        therapy_status: "open",
        duration: therapyDuration,
        
    }];
    let currentDate = nextDate(new Date(startDate));
    const requestedDays = organizeTherapies(therapyBatches);
    while (therapyList.length < therapyAmount) {
        if (currentDate.getDay().toString() in requestedDays) {
            for (const time of requestedDays[currentDate.getDay().toString()]) {
                console.log("TIME: ", time)
                therapyList.push({
                    title: `THERAPY ${therapyList.length + 1}`,
                    date: currentDate.toISOString().substring(0, 10),
                    area_id: workingAreaID, 
                    time: time,
                    therapy_status: "open",
                    duration: therapyDuration
                });
            }
        }
        currentDate = nextDate(currentDate);
    }
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

const showToastMessage = async(message, type) => {
    // You can implement your own toast notification logic here, or use a library like Toastify.
    // Example using an alert for simplicity (replace with a toast library in your actual project).
    if (type === "success") {
        alert(message);
    } else if (type === "error") {
        alert("Error: " + message);
    }
};

const exports = {
    handleSetInput,
    sleep,
    getToday,
    getCurrentHour,
    calculateEndHour,
    generateTherapyList,
    getDate,
    getHour,
    showToastMessage,
};

export default exports;
