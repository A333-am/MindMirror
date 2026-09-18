function checkSleepRoutine() {
    const routine1 =
        document.getElementById("sleepRoutine1").checked;

    const routine2 =
        document.getElementById("sleepRoutine2").checked;

    const routine3 =
        document.getElementById("sleepRoutine3").checked;

    const routine4 =
        document.getElementById("sleepRoutine4").checked;


    const completed =
        [routine1, routine2, routine3, routine4]
        .filter(Boolean).length;


    localStorage.setItem(
        "mindmirrorSleepRoutine",
        completed
    );


    if (completed === 4) {

        document.getElementById("sleep-result").innerHTML =
            "<div class='cbt-complete'>" +
            "<h3>🌙 Sleep Routine Complete!</h3>" +
            "<p>You completed all of your bedtime routine activities. Great job! 🌱</p>" +
            "</div>";

    } else {

        document.getElementById("sleep-result").innerHTML =
            "<div class='cbt-complete'>" +
            "<h3>😴 Sleep Routine Progress</h3>" +
            "<p>You completed " +
            completed +
            " of 4 activities.</p>" +
            "<p>Keep going at your own pace. 🌱</p>" +
            "</div>";
    }
}


function saveSleepReminder() {

    const time =
        document.getElementById("sleepReminderTime").value;


    if (!time) {

        alert("Please choose a reminder time.");

        return;
    }


    localStorage.setItem(
        "mindmirrorSleepReminder",
        time
    );


    document.getElementById("sleep-reminder-result").innerHTML =
        "<div class='cbt-complete'>" +
        "<h3>⏰ Sleep Reminder Saved!</h3>" +
        "<p>Your bedtime reminder is set for <strong>" +
        time +
        "</strong>.</p>" +
        "</div>";
}


/* Restore saved Sleep data */
document.addEventListener("DOMContentLoaded", function () {

    // Restore Sleep Routine
    const savedSleepRoutine =
        localStorage.getItem("mindmirrorSleepRoutine");


    if (savedSleepRoutine !== null) {

        const completed =
            Number(savedSleepRoutine);


        const routines = [
            "sleepRoutine1",
            "sleepRoutine2",
            "sleepRoutine3",
            "sleepRoutine4"
        ];


        for (let i = 0; i < completed; i++) {

            const checkbox =
                document.getElementById(routines[i]);

            if (checkbox) {
                checkbox.checked = true;
            }
        }
    }


    // Restore Sleep Reminder
    const savedSleepReminder =
        localStorage.getItem("mindmirrorSleepReminder");


    if (savedSleepReminder) {

        document.getElementById("sleepReminderTime").value =
            savedSleepReminder;
    }

});