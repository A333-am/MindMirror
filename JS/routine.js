/* =========================================================
   MINDMIRROR - ROUTINE BUILDER
   ========================================================= */


/* =========================================================
   TASK ELEMENTS
   ========================================================= */

const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const completedCount =
    document.getElementById("completedCount");

const totalCount =
    document.getElementById("totalCount");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressFill =
    document.getElementById("progressFill");

const inputError =
    document.getElementById("inputError");

const completionMessage =
    document.getElementById("completionMessage");

const motivationQuote =
    document.getElementById("motivationQuote");


/* =========================================================
   REMINDER ELEMENTS
   ========================================================= */

const reminderDate =
    document.getElementById("reminderDate");

const reminderTime =
    document.getElementById("reminderTime");

const reminderMessage =
    document.getElementById("reminderMessage");

const saveReminderBtn =
    document.getElementById("saveReminderBtn");

const clearReminderBtn =
    document.getElementById("clearReminderBtn");

const reminderSaveMessage =
    document.getElementById("reminderSaveMessage");

const reminderPreview =
    document.getElementById("reminderPreview");

const previewDate =
    document.getElementById("previewDate");

const previewTime =
    document.getElementById("previewTime");

const previewMessage =
    document.getElementById("previewMessage");

const messageCharacterCount =
    document.getElementById(
        "messageCharacterCount"
    );

const reminderStatusDot =
    document.getElementById(
        "reminderStatusDot"
    );

const reminderStatusText =
    document.getElementById(
        "reminderStatusText"
    );


/* =========================================================
   POPUP ELEMENTS
   ========================================================= */

const reminderPopup =
    document.getElementById(
        "reminderPopup"
    );

const popupMessage =
    document.getElementById(
        "popupMessage"
    );

const closeReminderPopup =
    document.getElementById(
        "closeReminderPopup"
    );


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const STORAGE_KEY =
    "mindMirrorDailyRoutine";

const REMINDER_STORAGE_KEY =
    "mindMirrorRoutineReminder";

const REMINDER_TRIGGER_KEY =
    "mindMirrorLastTriggeredReminder";


/* =========================================================
   DEFAULT REMINDER
   ========================================================= */

const DEFAULT_REMINDER = {

    notification_type:
        "Routine Reminder",

    notification_date:
        "2026-09-26",

    notification_time:
        "07:00",

    message:
        "Time to complete your morning routine."

};


/* =========================================================
   TASK DATA
   ========================================================= */

let tasks =
    loadTasks();


/* =========================================================
   MOTIVATION QUOTES
   ========================================================= */

const motivationQuotes = [

    "Small steps every day lead to meaningful change.",

    "You don't have to do everything at once. Just take one step.",

    "Progress is progress, no matter how small.",

    "A better day can begin with one small action.",

    "Be patient with yourself. You are doing your best.",

    "Every completed task is a step forward.",

    "Consistency matters more than perfection.",

    "Take it one task, one moment, one day at a time.",

    "Believe in the small progress you make each day.",

    "You are building better habits, one step at a time."

];


/* =========================================================
   INITIALIZE PAGE
   ========================================================= */

renderTasks();

updateMotivationQuote();

initializeReminder();

checkReminder();


/* =========================================================
   TASK FUNCTIONS
   ========================================================= */


/*
    Load tasks from localStorage.
*/

function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!savedTasks) {

            return [];

        }

        const parsedTasks =
            JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {

            return [];

        }

        return parsedTasks;

    } catch (error) {

        console.error(
            "Unable to load routine tasks:",
            error
        );

        return [];

    }

}


/*
    Save tasks to localStorage.
*/

function saveTasks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error(
            "Unable to save routine tasks:",
            error
        );

    }

}


/*
    Add a new task.
*/

function addTask() {

    const taskText =
        taskInput.value.trim();

    inputError.textContent = "";


    if (!taskText) {

        inputError.textContent =
            "Please enter a task.";

        taskInput.focus();

        return;

    }


    if (taskText.length > 100) {

        inputError.textContent =
            "Task should be less than 100 characters.";

        return;

    }


    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();

}


/*
    Delete task.
*/

function deleteTask(taskId) {

    tasks =
        tasks.filter(
            task =>
                task.id !== taskId
        );

    saveTasks();

    renderTasks();

}


/*
    Complete / uncomplete task.
*/

function toggleTask(taskId) {

    tasks =
        tasks.map(task => {

            if (task.id === taskId) {

                return {

                    ...task,

                    completed:
                        !task.completed

                };

            }

            return task;

        });


    saveTasks();

    renderTasks();

}


/*
    Render all tasks.
*/

function renderTasks() {

    taskList.innerHTML = "";


    if (tasks.length === 0) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    tasks.forEach(task => {

        const taskItem =
            document.createElement("div");

        taskItem.className =
            "task-item";


        if (task.completed) {

            taskItem.classList.add(
                "completed"
            );

        }


        /* Checkbox */

        const checkbox =
            document.createElement(
                "input"
            );

        checkbox.type =
            "checkbox";

        checkbox.className =
            "task-checkbox";

        checkbox.checked =
            task.completed;


        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );


        checkbox.addEventListener(
            "change",
            function () {

                toggleTask(task.id);

            }
        );


        /* Task text */

        const taskText =
            document.createElement(
                "span"
            );

        taskText.className =
            "task-text";

        taskText.textContent =
            task.text;


        /* Delete button */

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.type =
            "button";

        deleteButton.className =
            "delete-task";

        deleteButton.innerHTML =
            "🗑";

        deleteButton.title =
            "Delete task";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );


        deleteButton.addEventListener(
            "click",
            function () {

                deleteTask(task.id);

            }
        );


        taskItem.appendChild(
            checkbox
        );

        taskItem.appendChild(
            taskText
        );

        taskItem.appendChild(
            deleteButton
        );

        taskList.appendChild(
            taskItem
        );

    });


    updateProgress();

}


/*
    Update task progress.
*/

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    totalCount.textContent =
        total;

    completedCount.textContent =
        completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressPercentage.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    if (
        total > 0 &&
        completed === total
    ) {

        completionMessage.classList.remove(
            "hidden"
        );

    } else {

        completionMessage.classList.add(
            "hidden"
        );

    }

}


/*
    Show random motivation.
*/

function updateMotivationQuote() {

    if (!motivationQuote) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            motivationQuotes.length
        );


    motivationQuote.textContent =
        motivationQuotes[
            randomIndex
        ];

}


/* =========================================================
   REMINDER FUNCTIONS
   ========================================================= */


/*
    Initialize reminder.

    If no reminder has been saved,
    the supplied default reminder is used.
*/

function initializeReminder() {

    const savedReminder =
        loadReminder();


    if (savedReminder) {

        populateReminderForm(
            savedReminder
        );

        updateReminderPreview(
            savedReminder
        );

        setReminderStatus(true);

    } else {

        populateReminderForm(
            DEFAULT_REMINDER
        );

        updateReminderPreview(
            DEFAULT_REMINDER
        );

        setReminderStatus(false);

    }


    updateCharacterCount();

}


/*
    Load reminder from localStorage.
*/

function loadReminder() {

    try {

        const savedReminder =
            localStorage.getItem(
                REMINDER_STORAGE_KEY
            );


        if (!savedReminder) {

            return null;

        }


        const parsedReminder =
            JSON.parse(
                savedReminder
            );


        if (
            !parsedReminder ||
            typeof parsedReminder !==
                "object"
        ) {

            return null;

        }


        return parsedReminder;

    } catch (error) {

        console.error(
            "Unable to load reminder:",
            error
        );

        return null;

    }

}


/*
    Save reminder to localStorage.
*/

function saveReminder(
    reminderData
) {

    try {

        localStorage.setItem(
            REMINDER_STORAGE_KEY,
            JSON.stringify(
                reminderData
            )
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save reminder:",
            error
        );

        return false;

    }

}


/*
    Get reminder from form.
*/

function getReminderFromForm() {

    return {

        notification_type:
            "Routine Reminder",

        notification_date:
            reminderDate.value,

        notification_time:
            reminderTime.value,

        message:
            reminderMessage.value.trim()

    };

}


/*
    Populate form.
*/

function populateReminderForm(
    reminder
) {

    reminderDate.value =
        reminder.notification_date || "";

    reminderTime.value =
        reminder.notification_time || "";

    reminderMessage.value =
        reminder.message || "";

}


/*
    Update reminder preview.
*/

function updateReminderPreview(
    reminder
) {

    if (
        !reminder ||
        !reminder.notification_date
    ) {

        previewDate.textContent =
            "—";

        previewTime.textContent =
            "—";

        previewMessage.textContent =
            "No reminder set yet.";

        return;

    }


    previewDate.textContent =
        formatDate(
            reminder.notification_date
        );


    previewTime.textContent =
        formatTime(
            reminder.notification_time
        );


    previewMessage.textContent =
        reminder.message ||
        "No reminder message.";

}


/*
    Update active/inactive status.
*/

function setReminderStatus(
    active
) {

    if (active) {

        reminderStatusDot.classList.add(
            "active"
        );

        reminderStatusText.textContent =
            "Reminder set";

    } else {

        reminderStatusDot.classList.remove(
            "active"
        );

        reminderStatusText.textContent =
            "Not set";

    }

}


/*
    Format date.

    Example:
    2026-09-26
    becomes
    26 September 2026
*/

function formatDate(
    dateString
) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (Number.isNaN(
        date.getTime()
    )) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/*
    Format time.

    Example:
    07:00
    becomes
    7:00 AM
*/

function formatTime(
    timeString
) {

    if (!timeString) {

        return "—";

    }


    const parts =
        timeString.split(":");


    if (parts.length < 2) {

        return timeString;

    }


    let hours =
        parseInt(
            parts[0],
            10
        );

    const minutes =
        parts[1];


    if (Number.isNaN(hours)) {

        return timeString;

    }


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    return `${hours}:${minutes} ${period}`;

}


/*
    Update message character count.
*/

function updateCharacterCount() {

    const length =
        reminderMessage.value.length;


    messageCharacterCount.textContent =
        length;

}


/* =========================================================
   SAVE REMINDER
   ========================================================= */

function handleSaveReminder() {

    reminderSaveMessage.textContent =
        "";


    const reminder =
        getReminderFromForm();


    /* Validate date */

    if (!reminder.notification_date) {

        reminderSaveMessage.textContent =
            "Please select a reminder date.";

        reminderSaveMessage.style.color =
            "#B85C5C";

        reminderDate.focus();

        return;

    }


    /* Validate time */

    if (!reminder.notification_time) {

        reminderSaveMessage.textContent =
            "Please select a reminder time.";

        reminderSaveMessage.style.color =
            "#B85C5C";

        reminderTime.focus();

        return;

    }


    /* Validate message */

    if (!reminder.message) {

        reminderSaveMessage.textContent =
            "Please enter a reminder message.";

        reminderSaveMessage.style.color =
            "#B85C5C";

        reminderMessage.focus();

        return;

    }


    /* Save */

    const saved =
        saveReminder(
            reminder
        );


    if (!saved) {

        reminderSaveMessage.textContent =
            "Unable to save the reminder.";

        reminderSaveMessage.style.color =
            "#B85C5C";

        return;

    }


    updateReminderPreview(
        reminder
    );


    setReminderStatus(true);


    reminderSaveMessage.textContent =
        "Reminder saved on this device.";

    reminderSaveMessage.style.color =
        "#4F8A68";


    /*
        Reset the trigger state so that
        a newly edited reminder can trigger.
    */

    localStorage.removeItem(
        REMINDER_TRIGGER_KEY
    );

}


/* =========================================================
   CLEAR REMINDER
   ========================================================= */

function handleClearReminder() {

    const confirmed =
        window.confirm(
            "Do you want to clear this routine reminder?"
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        REMINDER_STORAGE_KEY
    );


    localStorage.removeItem(
        REMINDER_TRIGGER_KEY
    );


    reminderDate.value = "";

    reminderTime.value = "";

    reminderMessage.value = "";


    previewDate.textContent =
        "—";

    previewTime.textContent =
        "—";

    previewMessage.textContent =
        "No reminder set yet.";


    setReminderStatus(false);


    updateCharacterCount();


    reminderSaveMessage.textContent =
        "Reminder cleared.";

    reminderSaveMessage.style.color =
        "#4F8A68";

}


/* =========================================================
   REMINDER CHECK
   ========================================================= */


/*
    Check whether the reminder
    should be displayed.

    This works while the page is open.
*/

function checkReminder() {

    const reminder =
        loadReminder();


    if (!reminder) {

        return;

    }


    if (
        !reminder.notification_date ||
        !reminder.notification_time
    ) {

        return;

    }


    const reminderDateTime =
        new Date(
            `${reminder.notification_date}T${reminder.notification_time}:00`
        );


    if (
        Number.isNaN(
            reminderDateTime.getTime()
        )
    ) {

        return;

    }


    const now =
        new Date();


    /*
        We use a small time window so that
        the reminder can trigger if the page
        checks a few seconds after the exact time.
    */

    const difference =
        now.getTime() -
        reminderDateTime.getTime();


    const triggerWindow =
        60 * 1000;


    if (
        difference >= 0 &&
        difference <= triggerWindow
    ) {

        const triggerKey =
            `${reminder.notification_date}_${reminder.notification_time}`;


        const lastTriggered =
            localStorage.getItem(
                REMINDER_TRIGGER_KEY
            );


        if (
            lastTriggered !==
            triggerKey
        ) {

            showReminderPopup(
                reminder.message
            );


            localStorage.setItem(
                REMINDER_TRIGGER_KEY,
                triggerKey
            );

        }

    }

}


/* =========================================================
   SHOW REMINDER POPUP
   ========================================================= */

function showReminderPopup(
    message
) {

    popupMessage.textContent =
        message;


    reminderPopup.classList.remove(
        "hidden"
    );


    /*
        Optional browser notification.

        The user must grant permission.
        If permission is unavailable,
        the in-page popup still works.
    */

    showBrowserNotification(
        message
    );

}


/* =========================================================
   BROWSER NOTIFICATION
   ========================================================= */

function showBrowserNotification(
    message
) {

    /*
        Check whether browser notifications
        are supported.
    */

    if (
        !("Notification" in window)
    ) {

        return;

    }


    /*
        Only show automatically if
        permission has already been granted.

        We do NOT automatically request
        permission when the page loads.
    */

    if (
        Notification.permission ===
        "granted"
    ) {

        new Notification(
            "MindMirror - Routine Reminder",
            {
                body: message,
                icon: "Images/logo.png"
            }
        );

    }

}


/* =========================================================
   REQUEST NOTIFICATION PERMISSION
   ========================================================= */

async function requestNotificationPermission() {

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission ===
        "default"
    ) {

        try {

            await Notification.requestPermission();

        } catch (error) {

            console.error(
                "Notification permission error:",
                error
            );

        }

    }

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */


/*
    Add task button.
*/

addTaskBtn.addEventListener(
    "click",
    addTask
);


/*
    Enter key for task.
*/

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addTask();

        }

    }
);


/*
    Clear task error.
*/

taskInput.addEventListener(
    "input",
    function () {

        inputError.textContent =
            "";

    }
);


/*
    Save reminder.
*/

saveReminderBtn.addEventListener(
    "click",
    function () {

        handleSaveReminder();

        /*
            Request permission after
            the user explicitly interacts
            with the reminder feature.
        */

        requestNotificationPermission();

    }
);


/*
    Clear reminder.
*/

clearReminderBtn.addEventListener(
    "click",
    handleClearReminder
);


/*
    Character count.
*/

reminderMessage.addEventListener(
    "input",
    function () {

        updateCharacterCount();

        reminderSaveMessage.textContent =
            "";

    }
);


/*
    Clear reminder status message
    when user changes date/time.
*/

reminderDate.addEventListener(
    "change",
    function () {

        reminderSaveMessage.textContent =
            "";

    }
);


reminderTime.addEventListener(
    "change",
    function () {

        reminderSaveMessage.textContent =
            "";

    }
);


/*
    Close popup.
*/

closeReminderPopup.addEventListener(
    "click",
    function () {

        reminderPopup.classList.add(
            "hidden"
        );

    }
);


/* =========================================================
   REMINDER TIMER
   ========================================================= */


/*
    Check every 30 seconds.

    This means the page does not need
    to be manually refreshed.
*/

setInterval(
    checkReminder,
    30 * 1000
);


/*
    Check when the user returns
    to the browser tab.
*/

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            checkReminder();

        }

    }
);


/* =========================================================
   FRONTEND API HOOK
   ========================================================= */


/*
    This function gives your backend teammate
    the exact reminder object later.

    Example result:

    {
        notification_type: "Routine Reminder",
        notification_date: "2026-09-26",
        notification_time: "07:00",
        message: "Time to complete your morning routine."
    }

    Currently this is NOT sent to Flask.
*/

function getRoutineReminderPayload() {

    return loadReminder();

}