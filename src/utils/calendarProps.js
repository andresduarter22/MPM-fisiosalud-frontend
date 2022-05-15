const calendarProps = {
    options: {
        transitionMode: "zoom", // or fade
        startWeekOn: "Mon",     // or Sun
        defaultMode: "week",    // or week | day | timeline
        minWidth: 540,
        maxWidth: 540,
        minHeight: 540,
        maxHeight: 540
    },
    alertProps: {
        open: true,
        color: "info",          // info | success | warning | error
        severity: "info",       // info | success | warning | error
        message: "🚀 Let's start with awesome react-mui-scheduler 🔥 🔥 🔥",
        showActionButton: true,
        showNotification: true,
        delay: 1500
    },
    toolbarProps: {
        showSearchBar: true,
        showSwitchModeButtons: true,
        showDatePicker: true
    },
    month: {
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 6,
        startHour: 0,
        endHour: 24,
    },
    week: {
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 6,
        startHour: 0,
        endHour: 24,
        step: 15
    },
    day:{
        startHour: 0,
        endHour: 24,
        step: 15
    },
}

export default calendarProps;
