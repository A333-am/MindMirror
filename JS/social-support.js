function showSupportGuidance(type) {

    const result = document.getElementById("support-guidance-result");

    let title = "";
    let message = "";

    if (type === "trusted") {

        title = "💜 Talk to Someone You Trust";

        message =
            "Consider talking to a family member, friend, or another person " +
            "you feel comfortable with. Sharing how you feel can help you feel supported.";

    } else if (type === "counselor") {

        title = "💬 Talk to a Counselor";

        message =
            "A counselor can provide a safe and supportive space to discuss " +
            "your thoughts, feelings, and everyday challenges.";

    } else if (type === "professional") {

        title = "🩺 Seek Professional Support";

        message =
            "If you are experiencing persistent or difficult symptoms, consider " +
            "speaking with a qualified mental-health professional for appropriate support.";
    }


    localStorage.setItem(
        "mindmirrorSupportGuidance",
        type
    );


    result.innerHTML =
        "<div class='cbt-complete'>" +
        "<h3>" + title + "</h3>" +
        "<p>" + message + "</p>" +
        "</div>";
}


/* Restore the last selected guidance */
document.addEventListener("DOMContentLoaded", function () {

    const savedGuidance =
        localStorage.getItem("mindmirrorSupportGuidance");

    if (savedGuidance) {
        showSupportGuidance(savedGuidance);
    }

});