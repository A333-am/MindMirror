// ==========================================
// MindMirror AI - Progress Dashboard
// ==========================================

// Mood elements
const moodDisplay = document.getElementById("moodDisplay");
const intensityDisplay = document.getElementById("intensityDisplay");
const dateDisplay = document.getElementById("dateDisplay");

// Reflection elements
const noteDisplay = document.getElementById("noteDisplay");
const progressMessage = document.getElementById("progressMessage");


// ==========================================
// LOAD SAVED MOOD
// ==========================================

const savedMood = localStorage.getItem("mindMirrorMood") || localStorage.getItem("selectedMood");

if (savedMood) {

    try {

        const moodData =
            JSON.parse(savedMood) && typeof JSON.parse(savedMood) === "object"
                ? JSON.parse(savedMood)
                : { mood: savedMood };

        // Display mood
        if (moodDisplay) {
            moodDisplay.textContent = moodData.mood || "-";
        }

        // Display intensity
        if (intensityDisplay) {
            intensityDisplay.textContent =
                (moodData.intensity || "-") + " / 10";
        }

        // Display date
        if (dateDisplay) {
            dateDisplay.textContent = moodData.date || "-";
        }

    } catch (error) {

        console.error("Unable to read saved mood:", error);

    }

} else {

    if (moodDisplay) {
        moodDisplay.textContent = "-";
    }

    if (intensityDisplay) {
        intensityDisplay.textContent = "-";
    }

    if (dateDisplay) {
        dateDisplay.textContent = "-";
    }

}


// ==========================================
// LOAD SAVED JOURNAL
// ==========================================

const savedJournal = localStorage.getItem("mindMirrorJournal");

if (savedJournal) {

    try {

        const journalData = JSON.parse(savedJournal);

        if (noteDisplay) {

            if (journalData.entry && journalData.entry.trim() !== "") {

                noteDisplay.textContent = journalData.entry;

            } else {

                noteDisplay.textContent =
                    "No reflection was added yet.";

            }

        }

        if (progressMessage) {

            progressMessage.textContent =
                "Your latest mood and journal entry are displayed above.";

        }

    } catch (error) {

        console.error("Unable to read saved journal:", error);

    }

} else {

    if (noteDisplay) {

        noteDisplay.textContent =
            "No journal entry available yet. Write something in your journal first.";

    }

    if (progressMessage) {

        progressMessage.textContent =
            "Complete a mood check-in or write a journal entry to see your progress.";

    }

}