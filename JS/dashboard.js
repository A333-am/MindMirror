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

    if (dashboardMood && savedMood) {
        dashboardMood.textContent = savedMood;
    }

});