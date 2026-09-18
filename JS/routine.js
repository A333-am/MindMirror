function addRoutineActivity() {
    const input = document.getElementById("routineInput");
    const activity = input.value.trim();

    if (!activity) {
        alert("Please enter a routine activity.");
        return;
    }

    const activities =
        JSON.parse(localStorage.getItem("mindmirrorRoutineActivities")) || [];

    activities.push({
        text: activity,
        completed: false
    });

    localStorage.setItem(
        "mindmirrorRoutineActivities",
        JSON.stringify(activities)
    );

    input.value = "";

    displayRoutineActivities();
}


function displayRoutineActivities() {
    const list = document.getElementById("routine-list");

    if (!list) return;

    const activities =
        JSON.parse(localStorage.getItem("mindmirrorRoutineActivities")) || [];

    list.innerHTML = "";

    if (activities.length === 0) {
        list.innerHTML =
            "<p>No routine activities added yet. 🌱</p>";
        return;
    }

    activities.forEach(function (activity, index) {

        const routineItem = document.createElement("div");

        routineItem.className = "cbt-complete";

        routineItem.innerHTML =
            "<label>" +
            "<input type='checkbox' " +
            (activity.completed ? "checked" : "") +
            " onchange='toggleRoutineActivity(" +
            index +
            ")'>" +
            " " +
            activity.text +
            "</label>" +

            "<br><br>" +

            "<button onclick='deleteRoutineActivity(" +
            index +
            ")'>" +
            "🗑️ Delete" +
            "</button>";

        list.appendChild(routineItem);
    });
}


function toggleRoutineActivity(index) {

    const activities =
        JSON.parse(localStorage.getItem("mindmirrorRoutineActivities")) || [];

    if (!activities[index]) return;

    activities[index].completed =
        !activities[index].completed;

    localStorage.setItem(
        "mindmirrorRoutineActivities",
        JSON.stringify(activities)
    );

    displayRoutineActivities();
}


function deleteRoutineActivity(index) {

    const activities =
        JSON.parse(localStorage.getItem("mindmirrorRoutineActivities")) || [];

    activities.splice(index, 1);

    localStorage.setItem(
        "mindmirrorRoutineActivities",
        JSON.stringify(activities)
    );

    displayRoutineActivities();
}


/* Load saved routine activities */
document.addEventListener("DOMContentLoaded", function () {
    displayRoutineActivities();
});