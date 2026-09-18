// ==========================================
// MindMirror AI - Wellness Companion
// ==========================================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const quickButtons = document.querySelectorAll(".quick-btn");


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(message, sender) {

    if (!chatBox) return;

    const messageDiv = document.createElement("div");

    messageDiv.className = `message ${sender}`;

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.textContent =
        sender === "bot" ? "🌿" : "👤";


    const text = document.createElement("div");

    text.className = "message-text";

    text.textContent = message;


    messageDiv.appendChild(avatar);
    messageDiv.appendChild(text);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// ==========================================
// CBT-BASED RESPONSES
// ==========================================

function getReply(text) {

    const message = text.toLowerCase();


    // Stress
    if (
        message.includes("stress") ||
        message.includes("stressed") ||
        message.includes("exam")
    ) {

        return "I hear that you're feeling stressed. 🌿 Let's slow things down. Take one slow breath and try to focus only on the next small task you can manage.";
    }


    // Anxiety
    if (
        message.includes("anxious") ||
        message.includes("anxiety") ||
        message.includes("worried") ||
        message.includes("worry")
    ) {

        return "It sounds like you're dealing with a lot of worry. Try noticing the thought that is making you anxious and ask yourself: 'Is this thought definitely true, or is there another way to look at it?'";
    }


    // Sadness
    if (
        message.includes("sad") ||
        message.includes("depressed") ||
        message.includes("down")
    ) {

        return "I'm sorry you're having a difficult moment. 💜 Your feelings are important. Try being kind to yourself and think of one small activity that usually gives you some comfort.";
    }


    // Happy
    if (
        message.includes("happy") ||
        message.includes("good") ||
        message.includes("great")
    ) {

        return "I'm glad you're feeling good today! 😊 Take a moment to notice what contributed to this feeling. Recognizing positive experiences can help you understand your emotional patterns.";
    }


    // Tired / Sleep
    if (
        message.includes("tired") ||
        message.includes("sleep") ||
        message.includes("exhausted")
    ) {

        return "It sounds like your mind or body may need some rest. 🌙 Consider taking a short break, reducing screen time before bed, and following a calm bedtime routine.";
    }


    // Lonely
    if (
        message.includes("lonely") ||
        message.includes("alone")
    ) {

        return "Feeling lonely can be difficult. You don't have to handle everything by yourself. Consider reaching out to someone you trust, even with a simple message.";
    }


    // Negative thoughts
    if (
        message.includes("negative") ||
        message.includes("overthink") ||
        message.includes("overthinking")
    ) {

        return "When thoughts keep repeating, try writing the thought down. Then ask: 'What evidence supports this thought?' and 'What evidence might not support it?' This can help create a more balanced perspective.";
    }


    // Relax
    if (
        message.includes("relax") ||
        message.includes("calm") ||
        message.includes("breath")
    ) {

        return "Let's create a calm moment. 🌿 Take a slow breath in, and gently breathe out. You can also open the Guided Breathing exercise from your dashboard.";
    }


    // Serious distress
    if (
        message.includes("suicide") ||
        message.includes("kill myself") ||
        message.includes("hurt myself") ||
        message.includes("self harm")
    ) {

        return "I'm really sorry you're experiencing such intense feelings. Please don't face this alone. Reach out to a trusted person or a mental-health professional right now. If you feel you may be in immediate danger, contact your local emergency service.";
    }


    // Default
    return "Thank you for sharing that with me. 🌿 What you're feeling is worth paying attention to. Would you like to explore what happened, what you're thinking, or how you're feeling right now?";
}


// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {

    if (!userInput) return;

    const message = userInput.value.trim();

    if (message === "") return;


    addMessage(message, "user");

    userInput.value = "";


    // Small response delay
    setTimeout(function () {

        const reply = getReply(message);

        addMessage(reply, "bot");

    }, 700);
}


// ==========================================
// SEND BUTTON
// ==========================================

if (sendBtn) {

    sendBtn.addEventListener("click", sendMessage);

}


// ==========================================
// ENTER KEY
// ==========================================

if (userInput) {

    userInput.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    });

}


// ==========================================
// QUICK OPTIONS
// ==========================================

quickButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const message = button.textContent.trim();

        addMessage(message, "user");

        setTimeout(function () {

            addMessage(
                getReply(message),
                "bot"
            );

        }, 500);

    });

});


// ==========================================
// VOICE INPUT
// ==========================================

if (voiceBtn) {

    voiceBtn.addEventListener("click", function () {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Voice input is not supported in this browser."
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-US";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;


        recognition.start();


        voiceBtn.textContent = "🔴";


        recognition.onresult = function (event) {

            const speech =
                event.results[0][0].transcript;

            userInput.value = speech;

            sendMessage();

        };


        recognition.onerror = function () {

            voiceBtn.textContent = "🎤";

        };


        recognition.onend = function () {

            voiceBtn.textContent = "🎤";

        };

    });

}