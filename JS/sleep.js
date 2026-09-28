/* =========================================================
   MINDMIRROR
   SLEEP COMPANION
   FRONTEND ONLY
   ========================================================= */


/* =========================================================
   SLEEP ELEMENTS
   ========================================================= */

const sleepHoursInput =
    document.getElementById("sleepHours");

const qualityButtons =
    document.querySelectorAll(".quality-option");

const saveSleepButton =
    document.getElementById("saveSleepButton");

const sleepMessage =
    document.getElementById("sleepMessage");

const summaryHours =
    document.getElementById("summaryHours");

const summaryQuality =
    document.getElementById("summaryQuality");

const sleepInsightTitle =
    document.getElementById("sleepInsightTitle");

const sleepInsightText =
    document.getElementById("sleepInsightText");


/* =========================================================
   SLEEP STORAGE
   ========================================================= */

const STORAGE_KEY =
    "mindMirrorLatestSleep";


/* =========================================================
   SLEEP STATE
   ========================================================= */

let selectedQuality = "";


/* =========================================================
   REMINDER ELEMENTS
   ========================================================= */

const reminderType =
    document.getElementById("reminderType");

const reminderDate =
    document.getElementById("reminderDate");

const reminderTime =
    document.getElementById("reminderTime");

const reminderMessage =
    document.getElementById("reminderMessage");

const saveReminderButton =
    document.getElementById("saveReminderButton");

const cancelReminderButton =
    document.getElementById("cancelReminderButton");

const reminderMessageStatus =
    document.getElementById("reminderMessageStatus");

const savedReminder =
    document.getElementById("savedReminder");

const savedReminderTitle =
    document.getElementById("savedReminderTitle");

const savedReminderDate =
    document.getElementById("savedReminderDate");

const savedReminderText =
    document.getElementById("savedReminderText");


/* =========================================================
   REMINDER STORAGE
   ========================================================= */

const REMINDER_STORAGE_KEY =
    "mindMirrorSleepReminder";

const REMINDER_TRIGGER_KEY =
    "mindMirrorSleepReminderTriggered";


/* =========================================================
   DEFAULT REMINDER
   ========================================================= */

const DEFAULT_REMINDER = {

    notification_type:
        "Bedtime Reminder",

    notification_date:
        "2026-09-26",

    notification_time:
        "22:00",

    message:
        "It's time to start your bedtime routine."

};


/* =========================================================
   QUALITY SELECTION
   ========================================================= */

qualityButtons.forEach(button => {

    button.addEventListener("click", () => {


        /* Remove old selection */

        qualityButtons.forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


        /* Select current quality */

        button.classList.add(
            "selected"
        );


        selectedQuality =
            button.dataset.quality;


        clearSleepMessage();

    });

});


/* =========================================================
   SAVE SLEEP RECORD
   ========================================================= */

saveSleepButton.addEventListener(
    "click",
    () => {


        const hours =
            parseFloat(
                sleepHoursInput.value
            );


        /* Validate hours */

        if (
            Number.isNaN(hours) ||
            hours < 0 ||
            hours > 24
        ) {

            showSleepMessage(
                "Please enter a valid sleep duration between 0 and 24 hours.",
                "error"
            );

            sleepHoursInput.focus();

            return;

        }


        /* Validate quality */

        if (!selectedQuality) {

            showSleepMessage(
                "Please select your sleep quality.",
                "error"
            );

            return;

        }


        /* Create sleep record */

        const sleepRecord = {

            sleep_hours:
                hours,

            sleep_quality:
                selectedQuality,

            saved_at:
                new Date().toISOString()

        };


        /*
            FRONTEND ONLY

            This localStorage record can later be
            replaced with your Flask/Firebase API.
        */

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                sleepRecord
            )
        );


        /* Update summary */

        updateSummary(
            sleepRecord
        );


        /* Update insight */

        updateInsight(
            hours,
            selectedQuality
        );


        /* Success message */

        showSleepMessage(
            "Your sleep record was saved successfully!",
            "success"
        );

    }
);


/* =========================================================
   UPDATE SLEEP SUMMARY
   ========================================================= */

function updateSummary(record) {


    summaryHours.textContent =
        Number(
            record.sleep_hours
        ).toFixed(1);


    summaryQuality.textContent =
        record.sleep_quality;

}


/* =========================================================
   UPDATE SLEEP INSIGHT
   ========================================================= */

function updateInsight(
    hours,
    quality
) {


    let title =
        "Keep taking care of your sleep.";


    let message =
        "Small, consistent sleep habits can support your overall wellbeing.";


    /* =====================================================
       SLEEP DURATION
    ===================================================== */

    if (hours < 5) {

        title =
            "Your body may need more rest.";

        message =
            "If possible, give yourself some extra time to rest tonight and create a calm bedtime routine.";

    }


    else if (
        hours >= 5 &&
        hours < 7
    ) {

        title =
            "A little more rest may help.";

        message =
            "Consider giving yourself some additional sleep time when possible and keeping your bedtime routine consistent.";

    }


    else if (
        hours >= 7 &&
        hours <= 9
    ) {

        title =
            "You gave yourself a good amount of rest.";

        message =
            "Maintaining a consistent sleep schedule can help you continue supporting your wellbeing.";

    }


    else if (hours > 9) {

        title =
            "You had a longer sleep period.";

        message =
            "Notice how you feel during the day and try to keep your sleep schedule comfortable and consistent.";

    }


    /* =====================================================
       SLEEP QUALITY
    ===================================================== */

    if (quality === "Poor") {

        title =
            "Your sleep quality could use some care.";

        message =
            "Try a calm wind-down routine tonight, reduce distractions and give yourself a peaceful space to rest.";

    }


    else if (quality === "Excellent") {

        title =
            "That sounds like restful sleep.";

        message =
            "Keep the habits that helped you feel comfortable and rested.";

    }


    /* Update UI */

    sleepInsightTitle.textContent =
        title;

    sleepInsightText.textContent =
        message;

}


/* =========================================================
   LOAD LATEST SLEEP RECORD
   ========================================================= */

function loadLatestSleep() {


    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!saved) {

        return;

    }


    try {


        const record =
            JSON.parse(saved);


        /* Restore hours */

        sleepHoursInput.value =
            record.sleep_hours;


        /* Restore quality */

        selectedQuality =
            record.sleep_quality;


        qualityButtons.forEach(
            button => {

                if (
                    button.dataset.quality ===
                    record.sleep_quality
                ) {

                    button.classList.add(
                        "selected"
                    );

                }

            }
        );


        /* Restore summary */

        updateSummary(
            record
        );


        /* Restore insight */

        updateInsight(
            Number(
                record.sleep_hours
            ),
            record.sleep_quality
        );


    }

    catch (error) {

        console.error(
            "Unable to load sleep record:",
            error
        );

    }

}


/* =========================================================
   SLEEP MESSAGE
   ========================================================= */

function showSleepMessage(
    text,
    type
) {


    sleepMessage.textContent =
        text;


    sleepMessage.className =
        "message " + type;

}


function clearSleepMessage() {


    sleepMessage.textContent =
        "";


    sleepMessage.className =
        "message";

}


/* =========================================================
   REMINDER DATE DEFAULT
   ========================================================= */

function setDefaultReminder() {


    reminderType.value =
        DEFAULT_REMINDER.notification_type;


    reminderDate.value =
        DEFAULT_REMINDER.notification_date;


    reminderTime.value =
        DEFAULT_REMINDER.notification_time;


    reminderMessage.value =
        DEFAULT_REMINDER.message;

}


/* =========================================================
   SAVE REMINDER
   ========================================================= */

saveReminderButton.addEventListener(
    "click",
    saveSleepReminder
);


function saveSleepReminder() {


    const type =
        reminderType.value.trim();


    const date =
        reminderDate.value;


    const time =
        reminderTime.value;


    const message =
        reminderMessage.value.trim();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!date) {

        showReminderMessage(
            "Please select a reminder date.",
            "error"
        );

        reminderDate.focus();

        return;

    }


    if (!time) {

        showReminderMessage(
            "Please select a reminder time.",
            "error"
        );

        reminderTime.focus();

        return;

    }


    if (!message) {

        showReminderMessage(
            "Please enter a reminder message.",
            "error"
        );

        reminderMessage.focus();

        return;

    }


    /* =====================================================
       CHECK PAST DATE/TIME
    ===================================================== */

    const reminderDateTime =
        new Date(
            `${date}T${time}`
        );


    if (
        Number.isNaN(
            reminderDateTime.getTime()
        )
    ) {

        showReminderMessage(
            "Please select a valid date and time.",
            "error"
        );

        return;

    }


    if (
        reminderDateTime.getTime() <=
        Date.now()
    ) {

        showReminderMessage(
            "Please select a future date and time.",
            "error"
        );

        return;

    }


    /* =====================================================
       CREATE REMINDER OBJECT
    ===================================================== */

    const reminder = {

        notification_type:
            type,

        notification_date:
            date,

        notification_time:
            time,

        message:
            message,

        created_at:
            new Date().toISOString()

    };


    /* =====================================================
       SAVE TO LOCAL STORAGE
    ===================================================== */

    localStorage.setItem(
        REMINDER_STORAGE_KEY,
        JSON.stringify(
            reminder
        )
    );


    /*
        Reset the triggered state.

        This allows a newly saved reminder
        to trigger normally.
    */

    localStorage.removeItem(
        REMINDER_TRIGGER_KEY
    );


    /* =====================================================
       UPDATE SAVED REMINDER UI
    ===================================================== */

    displaySavedReminder(
        reminder
    );


    /* =====================================================
       REQUEST NOTIFICATION PERMISSION
    ===================================================== */

    requestNotificationPermission();


    /* =====================================================
       SUCCESS
    ===================================================== */

    showReminderMessage(
        "Your sleep reminder has been saved successfully!",
        "success"
    );

}


/* =========================================================
   DISPLAY SAVED REMINDER
   ========================================================= */

function displaySavedReminder(
    reminder
) {


    savedReminderTitle.textContent =
        reminder.notification_type;


    savedReminderDate.textContent =
        formatReminderDateTime(
            reminder.notification_date,
            reminder.notification_time
        );


    savedReminderText.textContent =
        reminder.message;


    savedReminder.classList.remove(
        "hidden"
    );

}


/* =========================================================
   FORMAT REMINDER DATE
   ========================================================= */

function formatReminderDateTime(
    date,
    time
) {


    const dateObject =
        new Date(
            `${date}T${time}`
        );


    if (
        Number.isNaN(
            dateObject.getTime()
        )
    ) {

        return `${date} at ${time}`;

    }


    return dateObject.toLocaleString(
        undefined,
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   LOAD SAVED REMINDER
   ========================================================= */

function loadSavedReminder() {


    const saved =
        localStorage.getItem(
            REMINDER_STORAGE_KEY
        );


    if (!saved) {

        /*
            If there is no saved reminder,
            show the requested default values.
        */

        setDefaultReminder();

        return;

    }


    try {


        const reminder =
            JSON.parse(saved);


        reminderType.value =
            reminder.notification_type ||
            DEFAULT_REMINDER.notification_type;


        reminderDate.value =
            reminder.notification_date ||
            DEFAULT_REMINDER.notification_date;


        reminderTime.value =
            reminder.notification_time ||
            DEFAULT_REMINDER.notification_time;


        reminderMessage.value =
            reminder.message ||
            DEFAULT_REMINDER.message;


        displaySavedReminder(
            reminder
        );


    }

    catch (error) {

        console.error(
            "Unable to load sleep reminder:",
            error
        );


        setDefaultReminder();

    }

}


/* =========================================================
   CANCEL REMINDER
   ========================================================= */

cancelReminderButton.addEventListener(
    "click",
    cancelSleepReminder
);


function cancelSleepReminder() {


    localStorage.removeItem(
        REMINDER_STORAGE_KEY
    );


    localStorage.removeItem(
        REMINDER_TRIGGER_KEY
    );


    savedReminder.classList.add(
        "hidden"
    );


    setDefaultReminder();


    showReminderMessage(
        "Your sleep reminder has been cancelled.",
        "success"
    );

}


/* =========================================================
   REMINDER MESSAGE
   ========================================================= */

function showReminderMessage(
    text,
    type
) {


    reminderMessageStatus.textContent =
        text;


    reminderMessageStatus.className =
        "message " + type;

}


/* =========================================================
   BROWSER NOTIFICATION PERMISSION
   ========================================================= */

function requestNotificationPermission() {


    /*
        Notifications are supported only in browsers
        that provide the Notification API.

        Some browsers also require the page to be
        running on HTTPS or localhost.
    */

    if (
        !("Notification" in window)
    ) {

        return;

    }


    if (
        Notification.permission ===
        "default"
    ) {

        Notification.requestPermission()
            .then(permission => {

                console.log(
                    "Notification permission:",
                    permission
                );

            })
            .catch(error => {

                console.error(
                    "Notification permission error:",
                    error
                );

            });

    }

}


/* =========================================================
   SHOW SLEEP NOTIFICATION
   ========================================================= */

function showSleepNotification(
    reminder
) {


    const title =
        reminder.notification_type ||
        "Sleep Reminder";


    const message =
        reminder.message ||
        "It's time to start your bedtime routine.";


    /* =====================================================
       BROWSER NOTIFICATION
    ===================================================== */

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {


        try {


            new Notification(
                "MindMirror 🌙",
                {
                    body: message,
                    icon: "Images/logo.png"
                }
            );


        }

        catch (error) {

            console.error(
                "Unable to show notification:",
                error
            );

        }

    }


    /* =====================================================
       PAGE MESSAGE
    ===================================================== */

    showReminderMessage(
        `${title}: ${message}`,
        "success"
    );


    /* =====================================================
       OPTIONAL VISUAL ATTENTION
    ===================================================== */

    savedReminder.classList.add(
        "reminder-triggered"
    );


    setTimeout(
        () => {

            savedReminder.classList.remove(
                "reminder-triggered"
            );

        },
        5000
    );

}


/* =========================================================
   CHECK REMINDER
   ========================================================= */

function checkSleepReminder() {


    const saved =
        localStorage.getItem(
            REMINDER_STORAGE_KEY
        );


    if (!saved) {

        return;

    }


    try {


        const reminder =
            JSON.parse(saved);


        const reminderDateTime =
            new Date(
                `${reminder.notification_date}T${reminder.notification_time}`
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


        const difference =
            now.getTime() -
            reminderDateTime.getTime();


        /*
            Trigger when the scheduled time has arrived.

            The 60-second window prevents an old reminder
            from firing much later if the page was inactive.
        */

        if (
            difference >= 0 &&
            difference < 60000
        ) {


            const alreadyTriggered =
                localStorage.getItem(
                    REMINDER_TRIGGER_KEY
                );


            const reminderIdentifier =
                `${reminder.notification_date}_${reminder.notification_time}_${reminder.message}`;


            if (
                alreadyTriggered !==
                reminderIdentifier
            ) {


                showSleepNotification(
                    reminder
                );


                localStorage.setItem(
                    REMINDER_TRIGGER_KEY,
                    reminderIdentifier
                );

            }

        }

    }

    catch (error) {

        console.error(
            "Unable to check sleep reminder:",
            error
        );

    }

}


/* =========================================================
   INPUT MESSAGE CLEARING
   ========================================================= */

sleepHoursInput.addEventListener(
    "input",
    clearSleepMessage
);


reminderDate.addEventListener(
    "change",
    () => {

        reminderMessageStatus.textContent =
            "";

        reminderMessageStatus.className =
            "message";

    }
);


reminderTime.addEventListener(
    "change",
    () => {

        reminderMessageStatus.textContent =
            "";

        reminderMessageStatus.className =
            "message";

    }
);


/* =========================================================
   INITIALIZE SLEEP
   ========================================================= */

loadLatestSleep();


/* =========================================================
   INITIALIZE REMINDER
   ========================================================= */

loadSavedReminder();


/* =========================================================
   CHECK REMINDER EVERY 5 SECONDS
   ========================================================= */

setInterval(
    checkSleepReminder,
    5000
);


/* =========================================================
   CHECK ON PAGE LOAD
   ========================================================= */

checkSleepReminder();