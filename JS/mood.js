/* =========================================
   MINDMIRROR - DAILY CHECK-IN
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const moodOptions = document.querySelectorAll(".mood-option");
    const intensitySlider = document.getElementById("moodIntensity");
    const intensityValue = document.getElementById("intensityValue");

    const moodNote = document.getElementById("moodNote");
    const characterCount = document.getElementById("characterCount");

    const saveButton = document.getElementById("saveCheckinBtn");

    const moodError = document.getElementById("moodError");
    const checkinMessage = document.getElementById("checkinMessage");


    /* =========================================
       SELECTED MOOD
    ========================================= */

    let selectedMood = "";


    moodOptions.forEach((option) => {

        option.addEventListener("click", () => {

            moodOptions.forEach((item) => {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            selectedMood = option.dataset.mood;

            moodError.classList.remove("show");
            moodError.textContent = "";

            clearMessage();
        });

    });


    /* =========================================
       MOOD INTENSITY
    ========================================= */

    intensitySlider.addEventListener("input", () => {

        intensityValue.textContent = intensitySlider.value;

        clearMessage();

    });


    /* =========================================
       NOTE CHARACTER COUNT
    ========================================= */

    moodNote.addEventListener("input", () => {

        characterCount.textContent = moodNote.value.length;

        clearMessage();

    });


    /* =========================================
       SAVE CHECK-IN
    ========================================= */

    saveButton.addEventListener("click", saveCheckin);


    function saveCheckin() {

        clearMessage();

        /* Check mood */

        if (!selectedMood) {

            moodError.textContent =
                "Please select a mood before saving your check-in.";

            moodError.classList.add("show");

            showMessage(
                "Please choose how you are feeling today.",
                "error"
            );

            return;
        }


        /* Get values */

        const intensity = Number(intensitySlider.value);

        const note = moodNote.value.trim();

        const now = new Date();


        /* Temporary frontend check-in object */

        const checkin = {
            id: Date.now(),

            mood: selectedMood,

            intensity: intensity,

            note: note,

            date: now.toISOString(),

            displayDate: formatDate(now),

            displayTime: formatTime(now)
        };


        /*
         * TEMPORARY FRONTEND STORAGE
         *
         * This allows the page to work before
         * Flask/Firebase backend integration.
         */

        saveCheckinLocally(checkin);


        /* Success message */

        showMessage(
            "Your daily check-in was saved successfully.",
            "success"
        );


        /* Button feedback */

        const originalText = saveButton.textContent;

        saveButton.textContent = "Saved ✓";
        saveButton.disabled = true;


        setTimeout(() => {

            saveButton.textContent = originalText;
            saveButton.disabled = false;

        }, 1800);


        /* Optional reset after saving */

        setTimeout(() => {

            resetForm();

        }, 2200);

    }


    /* =========================================
       LOCAL STORAGE
    ========================================= */

    function saveCheckinLocally(checkin) {

        let checkins = [];

        try {

            const existing =
                localStorage.getItem("mindMirrorCheckins");

            if (existing) {
                checkins = JSON.parse(existing);
            }

            if (!Array.isArray(checkins)) {
                checkins = [];
            }

        } catch (error) {

            checkins = [];

        }


        checkins.push(checkin);


        /*
         * Keep recent check-ins only.
         * This is temporary until backend integration.
         */

        if (checkins.length > 50) {
            checkins = checkins.slice(-50);
        }


        localStorage.setItem(
            "mindMirrorCheckins",
            JSON.stringify(checkins)
        );


        /*
         * Also save the latest check-in separately.
         */

        localStorage.setItem(
            "mindMirrorLatestCheckin",
            JSON.stringify(checkin)
        );

    }


    /* =========================================
       RESET FORM
    ========================================= */

    function resetForm() {

        moodOptions.forEach((option) => {
            option.classList.remove("selected");
        });

        selectedMood = "";

        intensitySlider.value = 5;
        intensityValue.textContent = "5";

        moodNote.value = "";
        characterCount.textContent = "0";

    }


    /* =========================================
       SUCCESS / ERROR MESSAGE
    ========================================= */

    function showMessage(message, type) {

        checkinMessage.textContent = message;

        checkinMessage.className =
            `checkin-message ${type}`;

    }


    function clearMessage() {

        checkinMessage.textContent = "";

        checkinMessage.className =
            "checkin-message";

    }


    /* =========================================
       DATE FORMAT
    ========================================= */

    function formatDate(date) {

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    }


    /* =========================================
       TIME FORMAT
    ========================================= */

    function formatTime(date) {

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });

    }

});


/* =========================================
   NAVIGATION
========================================= */

function goToDashboard() {

    window.location.href = "dashboard.html";

}


function goToProgress() {

    window.location.href = "progress.html";

}