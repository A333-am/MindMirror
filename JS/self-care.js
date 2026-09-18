function addSelfCareReminder() {
    const input = document.getElementById("selfCareInput");
    const reminder = input.value.trim();

    if (!reminder) {
        alert("Please enter a self-care reminder.");
        return;
    }

    const reminders =
        JSON.parse(localStorage.getItem("mindmirrorSelfCareReminders")) || [];

    reminders.push(reminder);

    localStorage.setItem(
        "mindmirrorSelfCareReminders",
        JSON.stringify(reminders)
    );

    input.value = "";

    displaySelfCareReminders();
}


function displaySelfCareReminders() {
    const list = document.getElementById("self-care-list");

    if (!list) return;

    const reminders =
        JSON.parse(localStorage.getItem("mindmirrorSelfCareReminders")) || [];

    list.innerHTML = "";

    if (reminders.length === 0) {
        list.innerHTML =
            "<p>No self-care reminders added yet. 🌱</p>";
        return;
    }

    reminders.forEach(function (reminder, index) {

        const reminderItem = document.createElement("div");

        reminderItem.className = "cbt-complete";

        reminderItem.innerHTML =
            "<p>🌱 " +
            reminder +
            "</p>" +
            "<button onclick=\"deleteSelfCareReminder(" +
            index +
            ")\">" +
            "🗑️ Delete" +
            "</button>";

        list.appendChild(reminderItem);
    });
}


function deleteSelfCareReminder(index) {

    const reminders =
        JSON.parse(localStorage.getItem("mindmirrorSelfCareReminders")) || [];

    reminders.splice(index, 1);

    localStorage.setItem(
        "mindmirrorSelfCareReminders",
        JSON.stringify(reminders)
    );

    displaySelfCareReminders();
}


/* Load saved reminders */
document.addEventListener("DOMContentLoaded", function () {
    displaySelfCareReminders();
});