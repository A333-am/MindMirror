// Mood Intensity Slider

const moodRange = document.getElementById("moodRange");
const rangeValue = document.getElementById("rangeValue");

if (moodRange && rangeValue) {

    moodRange.addEventListener("input", () => {
        rangeValue.textContent = moodRange.value;
    });

}


// Mood Selection

const moodButtons = document.querySelectorAll(".mood-option");
const selectedMood = document.getElementById("selectedMood");

let currentMood = "";

moodButtons.forEach(button => {

    button.addEventListener("click", () => {

        moodButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentMood = button.dataset.mood;

        selectedMood.innerHTML =
            `Selected Mood: <strong>${currentMood}</strong>`;

    });

});


// Save Mood

const saveMood = document.getElementById("saveMood");
const moodMessage = document.getElementById("moodMessage");

if (saveMood) {

    saveMood.addEventListener("click", () => {

        // Check whether a mood has been selected
        if (currentMood === "") {

            moodMessage.innerHTML =
                "⚠️ Please select your mood first.";

            return;
        }

        // Get mood note
        const moodNote = document.getElementById("moodNote").value;

        // Get mood intensity
        const moodIntensity = moodRange.value;

        // Create mood data
        const moodData = {
            mood: currentMood,
            intensity: moodIntensity,
            note: moodNote,
            date: new Date().toLocaleDateString()
        };

        // Save data in browser
        localStorage.setItem("mindMirrorMood", JSON.stringify(moodData));

        // Show success message
        moodMessage.innerHTML =
            "✅ Mood saved successfully!";

        setTimeout(() => {

            moodMessage.innerHTML = "";

        }, 3000);

    });

}