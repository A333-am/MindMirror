function selectMoodBooster(activity) {

    const result = document.getElementById("mood-booster-result");

    let title = "";
    let message = "";

    if (activity === "music") {

        title = "🎵 Listen to Music";
        message =
            "Take a few minutes to listen to a song you enjoy. " +
            "Choose something calming or uplifting and give yourself time to relax.";

    } else if (activity === "gratitude") {

        title = "💜 Practice Gratitude";
        message =
            "Think of three things you are grateful for today. " +
            "They can be small, simple, or meaningful moments.";

    } else if (activity === "relaxation") {

        title = "🧘 Relaxation";
        message =
            "Take a few slow breaths and give your mind a short break. " +
            "You can also visit the Relax & Breathe section.";

    } else if (activity === "activity") {

        title = "🚶 Physical Activity";
        message =
            "Try a short walk, gentle stretching, or another activity you enjoy. " +
            "A little movement can be a positive break in your routine.";
    }


    localStorage.setItem(
        "mindmirrorLastMoodBooster",
        activity
    );


    result.innerHTML =
        "<div class='cbt-complete'>" +
        "<h3>" + title + "</h3>" +
        "<p>" + message + "</p>" +
        "</div>";
}


/* Restore the last selected activity */
document.addEventListener("DOMContentLoaded", function () {

    const savedActivity =
        localStorage.getItem("mindmirrorLastMoodBooster");

    if (savedActivity) {
        selectMoodBooster(savedActivity);
    }

});