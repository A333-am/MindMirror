document.addEventListener("DOMContentLoaded", function () {

    // Display today's date
    const todayDate = document.getElementById("todayDate");

    if (todayDate) {
        const today = new Date();

        todayDate.textContent = today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    // Display the user's saved mood
    const dashboardMood = document.getElementById("dashboardMood");
    const savedMood = localStorage.getItem("selectedMood");
    const savedMoodData = localStorage.getItem("mindMirrorMood");

    let moodToDisplay = savedMood;

    if (!moodToDisplay && savedMoodData) {
        try {
            const parsedMood = JSON.parse(savedMoodData);
            moodToDisplay = parsedMood.mood || null;
        } catch (error) {
            console.error("Unable to read saved mood for dashboard:", error);
        }
    }

    if (dashboardMood) {
        dashboardMood.textContent = moodToDisplay || "Not checked in";
    }

});