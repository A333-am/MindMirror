let cbtStep = 1;
let originalThought = "";

let cbtSession = {
    situation: "",
    thought: "",
    emotion: "",
    evidenceFor: "",
    evidenceAgainst: "",
    balancedThought: ""
};


async function submitCBT() {

    const answer =
        document.getElementById("cbt-answer").value.trim();


    if (!answer) {
        alert("Please enter an answer first.");
        return;
    }


    if (cbtStep === 1) {
        cbtSession.situation = answer;
    }

    if (cbtStep === 2) {
        cbtSession.thought = answer;
        originalThought = answer;
    }

    if (cbtStep === 3) {
        cbtSession.emotion = answer;
    }

    if (cbtStep === 4) {
        cbtSession.evidenceFor = answer;
    }

    if (cbtStep === 5) {
        cbtSession.evidenceAgainst = answer;
    }


    document.getElementById("cbt-result").innerHTML =
        "<div class='loading-message'>" +
        "MindMirror is thinking... 🌱" +
        "</div>";


    try {

        const response = fetch("/cbt-exercise", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                step: cbtStep,
                answer: answer
            })

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong."
            );
        }


        document.getElementById("cbt-question").textContent =
            data.question;


        document.getElementById("cbt-answer").value = "";


        cbtStep = data.step;


        document.getElementById("cbt-progress").textContent =
            "Step " + cbtStep + " of 6";


        document.getElementById("cbt-progress-bar").style.width =
            (cbtStep / 6 * 100) + "%";


        if (data.balanced_thought) {

            cbtSession.balancedThought =
                data.balanced_thought;

            cbtSession.date =
                new Date().toLocaleString();


            document.getElementById("cbt-summary").innerHTML =

                "<div class='cbt-complete'>" +

                "<h3>📋 Your CBT Reflection Summary</h3>" +

                "<p><strong>Situation:</strong> " +
                cbtSession.situation +
                "</p>" +

                "<p><strong>💭 Original Thought:</strong> " +
                cbtSession.thought +
                "</p>" +

                "<p><strong>❤️ Emotion:</strong> " +
                cbtSession.emotion +
                "</p>" +

                "<p><strong>🔍 Evidence For:</strong> " +
                cbtSession.evidenceFor +
                "</p>" +

                "<p><strong>⚖️ Evidence Against:</strong> " +
                cbtSession.evidenceAgainst +
                "</p>" +

                "<p><strong>🌱 Balanced Thought:</strong> " +
                cbtSession.balancedThought +
                "</p>" +

                "</div>";


            let cbtHistory =
                JSON.parse(
                    localStorage.getItem("mindmirrorCBTHistory")
                ) || [];


            cbtHistory.push(cbtSession);


            localStorage.setItem(
                "mindmirrorCBTHistory",
                JSON.stringify(cbtHistory)
            );


            localStorage.setItem(
                "mindmirrorCBTSession",
                JSON.stringify(cbtSession)
            );


            updateCBTSummary();
            updateEmotionInsights();
            updateEmotionTrend();


            document.getElementById("cbt-result").innerHTML =

                "<div class='cbt-complete'>" +

                "<h3>🌱 CBT Exercise Complete!</h3>" +

                "<p>You took a moment to reflect on your thoughts " +
                "and consider a more balanced perspective.</p>" +

                "<h3>💭 Your Original Thought</h3>" +

                "<p>" +
                originalThought +
                "</p>" +

                "<h3>🌱 Your Balanced Thought</h3>" +

                "<p>" +
                data.balanced_thought +
                "</p>" +

                "<p>" +
                data.message +
                "</p>" +

                "<button onclick='resetCBT()'>" +
                "🔄 Start Again" +
                "</button>" +

                "</div>";


        } else {

            document.getElementById("cbt-result").innerHTML =
                "<p>Step " +
                cbtStep +
                " of 6</p>";

        }


    } catch (error) {

        document.getElementById("cbt-result").innerHTML =

            "<div class='loading-message'>" +

            "Sorry, MindMirror could not process this response " +
            "right now. Please try again. 🌱" +

            "</div>";
    }
}


function resetCBT() {

    cbtStep = 1;

    originalThought = "";


    cbtSession = {
        situation: "",
        thought: "",
        emotion: "",
        evidenceFor: "",
        evidenceAgainst: "",
        balancedThought: ""
    };


    document.getElementById("cbt-question").textContent =
        "What situation is bothering you right now?";


    document.getElementById("cbt-answer").value = "";


    document.getElementById("cbt-result").innerHTML = "";


    document.getElementById("cbt-summary").innerHTML = "";


    document.getElementById("emotion-insights").innerHTML = "";


    document.getElementById("emotion-trend").innerHTML = "";


    document.getElementById("cbt-progress").textContent =
        "Step 1 of 6";


    document.getElementById("cbt-progress-bar").style.width =
        "16.66%";
}


function viewSavedCBT() {

    const savedSession =
        localStorage.getItem("mindmirrorCBTSession");


    if (!savedSession) {

        alert(
            "No saved CBT session found yet. 🌱"
        );

        return;
    }


    const session =
        JSON.parse(savedSession);


    document.getElementById("cbt-result").innerHTML =

        "<div class='cbt-complete'>" +

        "<h3>📖 Saved CBT Session</h3>" +

        "<h3>Situation</h3>" +
        "<p>" +
        session.situation +
        "</p>" +

        "<h3>💭 Original Thought</h3>" +
        "<p>" +
        session.thought +
        "</p>" +

        "<h3>❤️ Emotion</h3>" +
        "<p>" +
        session.emotion +
        "</p>" +

        "<h3>🔍 Evidence For</h3>" +
        "<p>" +
        session.evidenceFor +
        "</p>" +

        "<h3>⚖️ Evidence Against</h3>" +
        "<p>" +
        session.evidenceAgainst +
        "</p>" +

        "<h3>🌱 Balanced Thought</h3>" +
        "<p>" +
        session.balancedThought +
        "</p>" +

        "</div>";
}


function clearSavedCBT() {

    const savedSession =
        localStorage.getItem("mindmirrorCBTSession");


    if (!savedSession) {

        alert(
            "There is no saved CBT session to clear. 🌱"
        );

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to clear the saved CBT session?"
    );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "mindmirrorCBTSession"
    );


    alert(
        "Saved CBT session has been cleared. 🌱"
    );


    document.getElementById("cbt-result").innerHTML =

        "<div class='cbt-complete'>" +

        "<h3>🧹 Saved Session Cleared</h3>" +

        "<p>Your saved CBT session has been cleared successfully.</p>" +

        "</div>";
}


function updateCBTSummary() {

    const history =
        JSON.parse(
            localStorage.getItem("mindmirrorCBTHistory")
        ) || [];


    const summary =
        document.getElementById("cbt-summary");


    if (!summary) return;


    if (history.length === 0) {

        summary.innerHTML = "";

        return;
    }


    let totalIntensity = 0;
    let count = 0;


    history.forEach(function(session) {

        const match = session.emotion
            ? session.emotion.match(/\d+/)
            : null;


        if (match) {

            totalIntensity +=
                Number(match[0]);

            count++;
        }
    });


    const average =
        count > 0
            ? (totalIntensity / count).toFixed(1)
            : "N/A";


    const latest =
        history[history.length - 1];


    summary.innerHTML =

        "<div class='cbt-complete'>" +

        "<h3>📊 CBT Progress Summary</h3>" +

        "<p><strong>🧠 Sessions Completed:</strong> " +
        history.length +
        "</p>" +

        "<p><strong>📅 Latest Session:</strong> " +
        (latest.date || "Date not available") +
        "</p>" +

        "<p><strong>❤️ Average Emotion Intensity:</strong> " +
        average +
        (average !== "N/A" ? " / 10" : "") +
        "</p>" +

        "</div>";
}


function updateEmotionInsights() {

    const history =
        JSON.parse(
            localStorage.getItem("mindmirrorCBTHistory")
        ) || [];


    const insights =
        document.getElementById("emotion-insights");


    if (!insights) return;


    if (history.length === 0) {

        insights.innerHTML = "";

        return;
    }


    const emotionCounts = {};


    history.forEach(function(session) {

        if (!session.emotion) {
            return;
        }


        const emotionText =
            session.emotion.toLowerCase();


        const emotions = [
            "anxiety",
            "sadness",
            "anger",
            "stress",
            "happiness",
            "fear"
        ];


        emotions.forEach(function(emotion) {

            if (emotionText.includes(emotion)) {

                emotionCounts[emotion] =
                    (emotionCounts[emotion] || 0) + 1;
            }
        });
    });


    let insightsHTML =

        "<div class='cbt-complete'>" +

        "<h3>📈 Emotion Insights</h3>";


    if (
        Object.keys(emotionCounts).length === 0
    ) {

        insightsHTML +=
            "<p>Not enough emotion data yet. 🌱</p>";

    } else {

        insightsHTML +=
            "<p><strong>Most frequent emotions:</strong></p>";


        Object.keys(emotionCounts).forEach(
            function(emotion) {

                insightsHTML +=

                    "<p>❤️ " +

                    emotion.charAt(0).toUpperCase() +
                    emotion.slice(1) +

                    ": " +

                    emotionCounts[emotion] +

                    " session(s)</p>";
            }
        );
    }


    insightsHTML += "</div>";


    insights.innerHTML =
        insightsHTML;
}


function updateEmotionTrend() {

    const history =
        JSON.parse(
            localStorage.getItem("mindmirrorCBTHistory")
        ) || [];


    const trend =
        document.getElementById("emotion-trend");


    if (!trend) return;


    const intensities = [];


    history.forEach(function(session) {

        const match = session.emotion
            ? session.emotion.match(/\d+/)
            : null;


        if (match) {

            const value =
                Number(match[0]);


            if (
                value >= 0 &&
                value <= 10
            ) {

                intensities.push(value);
            }
        }
    });


    if (intensities.length < 2) {

        trend.innerHTML = "";

        return;
    }


    const first =
        intensities[0];


    const latest =
        intensities[intensities.length - 1];


    const difference =
        latest - first;


    let label;
    let icon;


    if (difference <= -1) {

        label = "decreased";
        icon = "📉";

    } else if (difference >= 1) {

        label = "increased";
        icon = "📈";

    } else {

        label = "stayed about the same";
        icon = "➡️";
    }


    trend.innerHTML =

        "<div class='cbt-complete'>" +

        "<h3>📊 Emotion Intensity Trend</h3>" +

        "<p>" +
        icon +
        " Your reported emotion intensity has " +
        label +
        " across your recorded sessions.</p>" +

        "<p><strong>First recorded intensity:</strong> " +
        first +
        " / 10</p>" +

        "<p><strong>Latest recorded intensity:</strong> " +
        latest +
        " / 10</p>" +

        "</div>";
}


function viewCBTHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("mindmirrorCBTHistory")
        ) || [];


    if (history.length === 0) {

        alert(
            "No CBT history found yet. 🌱"
        );

        return;
    }


    let historyHTML =

        "<div class='cbt-complete'>" +

        "<h3>🗂️ CBT History</h3>" +

        "<p><strong>Total Sessions:</strong> " +
        history.length +
        "</p>";


    history.forEach(function(session, index) {

        historyHTML +=

            "<hr>" +

            "<h3>Session " +
            (index + 1) +
            "</h3>" +

            "<p><strong>📅 Date:</strong> " +
            (session.date || "Date not available") +
            "</p>" +

            "<p><strong>Situation:</strong> " +
            session.situation +
            "</p>" +

            "<p><strong>Original Thought:</strong> " +
            session.thought +
            "</p>" +

            "<p><strong>Emotion:</strong> " +
            session.emotion +
            "</p>" +

            "<p><strong>Evidence For:</strong> " +
            session.evidenceFor +
            "</p>" +

            "<p><strong>Evidence Against:</strong> " +
            session.evidenceAgainst +
            "</p>" +

            "<p><strong>Balanced Thought:</strong> " +
            session.balancedThought +
            "</p>";
    });


    historyHTML += "</div>";


    document.getElementById("cbt-result").innerHTML =
        historyHTML;
}


function clearCBTHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("mindmirrorCBTHistory")
        ) || [];


    if (history.length === 0) {

        alert(
            "There is no CBT history to clear."
        );

        return;
    }


    const confirmed = confirm(
        "Are you sure you want to clear all CBT history?"
    );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "mindmirrorCBTHistory"
    );


    alert(
        "CBT history has been cleared."
    );


    document.getElementById("cbt-result").innerHTML =

        "<div class='cbt-complete'>" +

        "<h3>🗑️ CBT History Cleared</h3>" +

        "<p>Your saved CBT history has been cleared successfully.</p>" +

        "</div>";


    updateCBTSummary();
    updateEmotionInsights();
    updateEmotionTrend();
}


/* Load saved CBT information */
document.addEventListener("DOMContentLoaded", function () {

    updateCBTSummary();
    updateEmotionInsights();
    updateEmotionTrend();

});