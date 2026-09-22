const startButton = document.getElementById("startBreathing");
const stopButton = document.getElementById("stopBreathing");

const breathingText = document.getElementById("breathingText");
const timerDisplay = document.getElementById("timer");
const breathingMessage = document.getElementById("breathingMessage");

const avatarArea = document.querySelector(".avatar-area");

const breathingTypeButtons = document.querySelectorAll(".breathing-type-btn");
const cycleButtons = document.querySelectorAll(".cycle-btn");

let running = false;
let currentExercise = 0;
let currentCycle = 0;
let selectedCycles = null;
let selectedBreathingType = "deep";
let exerciseTimeout = null;
let timerInterval = null;
let venVoice = null;
let pendingSpeech = null;


/* ==========================================
   BREATHING EXERCISE
========================================== */

const breathingExercises = {
    deep: [
        {
            text: "Breathe In",
            duration: 4000,
            className: "breathe-in",
            message: "Slowly breathe in through your nose.",
            voice: "Breathe in slowly"
        },
        {
            text: "Breathe Out",
            duration: 6000,
            className: "breathe-out",
            message: "Slowly breathe out and relax.",
            voice: "Breathe out slowly"
        }
    ],

    box: [
        {
            text: "Breathe In",
            duration: 4000,
            className: "breathe-in",
            message: "Slowly breathe in through your nose.",
            voice: "Breathe in slowly"
        },
        {
            text: "Hold",
            duration: 4000,
            className: "hold-breath",
            message: "Gently hold your breath.",
            voice: "Hold gently"
        },
        {
            text: "Breathe Out",
            duration: 4000,
            className: "breathe-out",
            message: "Slowly breathe out and relax.",
            voice: "Breathe out slowly"
        },
        {
            text: "Hold",
            duration: 4000,
            className: "hold-breath",
            message: "Gently hold before the next breath.",
            voice: "Hold gently"
        }
    ],

    "478": [
        {
            text: "Breathe In",
            duration: 4000,
            className: "breathe-in",
            message: "Slowly breathe in through your nose.",
            voice: "Breathe in slowly"
        },
        {
            text: "Hold",
            duration: 7000,
            className: "hold-breath",
            message: "Gently hold your breath for seven seconds.",
            voice: "Hold your breath gently"
        },
        {
            text: "Breathe Out",
            duration: 8000,
            className: "breathe-out",
            message: "Slowly breathe out and relax.",
            voice: "Breathe out slowly"
        }
    ],

    slow: [
        {
            text: "Breathe In",
            duration: 4000,
            className: "breathe-in",
            message: "Slowly breathe in through your nose.",
            voice: "Breathe in slowly"
        },
        {
            text: "Breathe Out",
            duration: 6000,
            className: "breathe-out",
            message: "Slowly breathe out and relax.",
            voice: "Breathe out slowly"
        }
    ],

    belly: [
        {
            text: "Breathe In",
            duration: 4000,
            className: "breathe-in",
            message: "Breathe in gently and let your belly rise.",
            voice: "Breathe in gently and let your belly rise"
        },
        {
            text: "Breathe Out",
            duration: 6000,
            className: "breathe-out",
            message: "Breathe out slowly and let your belly soften.",
            voice: "Breathe out slowly and let your belly soften"
        }
    ]
};

let exercises = breathingExercises[selectedBreathingType];


/* ==========================================
   GENTLE VOICE
========================================== */

function speak(text) {

    if (!("speechSynthesis" in window) || !text) {
        return;
    }

    const voices = window.speechSynthesis.getVoices();

    if (!voices.length) {
        pendingSpeech = null;
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const fallbackSpeech = new SpeechSynthesisUtterance(text);
        fallbackSpeech.lang = "en-US";
        fallbackSpeech.rate = 0.65;
        fallbackSpeech.pitch = 0.9;
        fallbackSpeech.volume = 1;

        window.speechSynthesis.speak(fallbackSpeech);
        return;
    }

    if (!venVoice) {
        venVoice = voices.find(voice =>
            voice.lang.startsWith("en") &&
            (
                voice.name.toLowerCase().includes("female") ||
                voice.name.toLowerCase().includes("samantha") ||
                voice.name.toLowerCase().includes("zira")
            )
        ) || voices.find(voice => voice.lang.startsWith("en")) || voices[0];
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.65;
    speech.pitch = 0.9;
    speech.volume = 1;

    speech.voice = venVoice;

    window.speechSynthesis.speak(speech);
}


/* ==========================================
   BREATHING TYPE SELECTION
========================================== */

breathingTypeButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (running) {
            return;
        }

        selectedBreathingType = this.dataset.exercise;
        exercises = breathingExercises[selectedBreathingType] || breathingExercises.deep;

        breathingTypeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        breathingText.textContent = this.textContent.trim();
        breathingMessage.textContent =
            "Selected breathing exercise. Choose your cycles, then press Start Exercise.";

    });

});


/* ==========================================
   VEN ASKS FOR CYCLES
========================================== */

window.addEventListener("load", function () {

    breathingText.textContent = "Choose Your Session";

    breathingMessage.textContent =
        "Hi! I'm Ven 💜 How many breathing cycles would you like to do? Please choose 1, 3, or 5.";

    speak(
        "Hi! I'm Ven, how many breathing cycles would you like to do? Please choose one, three, or five cycles."
    );

});


/* ==========================================
   CYCLE SELECTION
========================================== */

cycleButtons.forEach(button => {

    button.addEventListener("click", function () {

        if (running) {
            return;
        }

        selectedCycles = parseInt(this.dataset.cycles);

        /* Remove active from all buttons */
        cycleButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        /* Activate selected button */
        this.classList.add("active");

        /* Show selected session */
        breathingText.textContent =
            selectedCycles + " Cycle" +
            (selectedCycles > 1 ? "s" : "") +
            " Selected";

        breathingMessage.textContent =
            "Great choice! Press Start Exercise when you're ready.";

        speak(
            "Great choice. You selected " +
            selectedCycles +
            " cycle" +
            (selectedCycles > 1 ? "s." : ".") +
            " Press Start Exercise when you're ready."
        );

    });

});


/* ==========================================
   START EXERCISE
========================================== */

startButton.addEventListener("click", function () {

    if (running) {
        return;
    }

    /* Make sure user selected cycles */
    if (selectedCycles === null) {

        breathingText.textContent = "Choose Your Session";

        breathingMessage.textContent =
            "Please choose 1, 3, or 5 cycles first.";

        speak(
            "Please choose one, three, or five breathing cycles first."
        );

        return;
    }

    running = true;

    currentExercise = 0;
    currentCycle = 1;

    startButton.textContent = "Exercise Running...";

    breathingText.textContent = "Get Comfortable";

    breathingMessage.textContent =
        "Relax your shoulders and follow my voice.";

    timerDisplay.textContent = "";

    speak(
        "Let's begin. Relax and follow my voice."
    );

    setTimeout(() => {

        if (running) {
            runExercise();
        }

    }, 1800);

});


/* ==========================================
   RUN BREATHING STEP
========================================== */
function runExercise() {
    if (!running) return;

    clearTimeout(exerciseTimeout);

    const exercise = exercises[currentExercise];

    breathingText.textContent = exercise.text;
    breathingMessage.textContent = exercise.message;
    timerDisplay.textContent = "";

    avatarArea.classList.remove(
        "breathe-in",
        "breathe-out",
        "hold-breath"
    );

    void avatarArea.offsetWidth;
    avatarArea.classList.add(exercise.className);

    startPhaseTimer(exercise.duration);

    // Voice for breathing instruction
    if (exercise.voice) {
        speak(exercise.voice);
    }

    exerciseTimeout = setTimeout(function () {

        if (!running) return;

        currentExercise++;

        // One complete breathing cycle finished
        if (currentExercise >= exercises.length) {

            currentExercise = 0;

            // All selected cycles finished
            if (currentCycle >= selectedCycles) {
                finishExercise();
                return;
            }

            // Start next cycle
            currentCycle++;

            breathingText.textContent =
                "Cycle " + currentCycle + " of " + selectedCycles;

            breathingMessage.textContent =
                "Get ready for the next cycle.";

            speak(
                "Now starting cycle " +
                currentCycle +
                " of " +
                selectedCycles
            );

            // Wait before starting breathing again
            exerciseTimeout = setTimeout(function () {

                if (!running) return;

                runExercise();

            }, 2500);

            return;
        }

        // Move to the next breathing phase
        runExercise();

    }, exercise.duration);
}


function startPhaseTimer(duration) {

    clearInterval(timerInterval);

    let secondsRemaining = Math.ceil(duration / 1000);
    timerDisplay.textContent = secondsRemaining + "s";

    timerInterval = setInterval(function () {

        secondsRemaining--;

        if (secondsRemaining <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "";
            return;
        }

        timerDisplay.textContent = secondsRemaining + "s";

    }, 1000);
}

/* ==========================================
   FINISH EXERCISE
========================================== */

function finishExercise() {

    running = false;

    clearTimeout(exerciseTimeout);
    clearInterval(timerInterval);

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    avatarArea.classList.remove(
        "breathe-in",
        "breathe-out",
        "hold-breath"
    );

    breathingText.textContent = "Well Done! 💜";

    timerDisplay.textContent = "";

    breathingMessage.textContent =
        "You completed " +
        selectedCycles +
        " breathing cycle" +
        (selectedCycles > 1 ? "s." : ".");

    startButton.textContent = "Start Exercise";

    speak(
        "Well done. You completed " +
        selectedCycles +
        " breathing cycle" +
        (selectedCycles > 1 ? "s." : ".") +
        " Take a moment to relax."
    );

}


/* ==========================================
   STOP EXERCISE
========================================== */

stopButton.addEventListener("click", function () {

    running = false;

    clearTimeout(exerciseTimeout);
    clearInterval(timerInterval);

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    breathingText.textContent = "Choose Your Session";

    timerDisplay.textContent = "";

    breathingMessage.textContent =
        "Hi! I'm Ven 💜 Please choose 1, 3, or 5 cycles.";

    avatarArea.classList.remove(
        "breathe-in",
        "breathe-out",
        "hold-breath"
    );

    startButton.textContent = "Start Exercise";

    /* Reset cycle selection */

    selectedCycles = null;
    currentCycle = 0;
    currentExercise = 0;

    cycleButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    speak(
        "Please choose one, three, or five breathing cycles when you're ready."
    );

});


/* ==========================================
   LOAD VOICES
========================================== */

if ("speechSynthesis" in window) {

    window.speechSynthesis.onvoiceschanged = function () {
        if (pendingSpeech) {
            const text = pendingSpeech;
            pendingSpeech = null;
            speak(text);
        }
    };

}