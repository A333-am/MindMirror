/* =========================================
   MINDMIRROR - WELLNESS PROGRESS
========================================= */


/* =========================================
   TEMPORARY FRONTEND DATA
========================================= */

const progressData = {

    /*
     * Temporary frontend values.
     *
     * Backend is NOT connected yet.
     * These will later be replaced by
     * your Flask API response.
     */

    checkins: 3,

    mindfulness: 12,

    moodBoosters: 8,

    journalEntries: 0,

    routines: 0,

    sleepRecords: 0,

    averageSleepHours: 0,

    routineCompletionPercentage: 0

};


/* =========================================
   MOOD SCORES
========================================= */

const moodScores = {

    Happy: 5,
    Excited: 5,
    Loved: 5,
    Confident: 5,

    Calm: 4,
    Relaxed: 4,
    Content: 4,
    Grateful: 4,

    Neutral: 3,

    Confused: 2,
    Worried: 2,
    Angry: 2,
    Frustrated: 2,
    Anxious: 2,
    Tired: 2,
    Stressed: 2,

    Sad: 1,
    Disappointed: 1,
    Lonely: 1,
    Scared: 1

};


/* =========================================
   MOOD EMOJIS
========================================= */

const moodEmojis = {

    Happy: "😊",
    Excited: "🤩",
    Loved: "🥰",
    Confident: "😎",

    Calm: "😌",
    Relaxed: "☺️",
    Content: "🙂",
    Grateful: "🙏",

    Neutral: "😐",

    Confused: "😕",
    Worried: "😟",
    Angry: "😠",
    Frustrated: "😤",
    Anxious: "😰",
    Tired: "😴",
    Stressed: "😫",

    Sad: "😔",
    Disappointed: "😞",
    Lonely: "🥺",
    Scared: "😨"

};


/* =========================================
   DEMO MOOD DATA
========================================= */

const demoMoodData = [

    {
        date: "Sep 18",
        mood: "Neutral",
        score: 3
    },

    {
        date: "Sep 19",
        mood: "Worried",
        score: 2
    },

    {
        date: "Sep 20",
        mood: "Calm",
        score: 4
    },

    {
        date: "Sep 21",
        mood: "Content",
        score: 4
    },

    {
        date: "Sep 22",
        mood: "Happy",
        score: 5
    },

    {
        date: "Sep 23",
        mood: "Calm",
        score: 4
    }

];


/* =========================================
   CHART INSTANCE
========================================= */

let activityChart = null;


/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProgress
);


function initializeProgress() {

    const realMoodData =
        getLocalStorageMoodData();


    /*
     * Use real frontend check-ins if
     * available. Otherwise use preview data.
     */

    let moodData;


    if (realMoodData.length >= 1) {

        moodData =
            realMoodData;

        hidePreviewNotice();

    } else {

        moodData =
            demoMoodData;

    }


    renderOverallProgress();

    renderMoodSummary(
        moodData
    );

    renderActivityChart();

    renderActivityDetails();

    renderSleepRoutine();

    renderReflection();

    renderLatestCheckin(
        moodData
    );

}


/* =========================================
   GET CHECK-INS FROM LOCAL STORAGE
========================================= */

function getLocalStorageMoodData() {

    try {

        const stored =
            localStorage.getItem(
                "mindMirrorCheckins"
            );


        if (!stored) {

            return [];

        }


        const checkins =
            JSON.parse(stored);


        if (!Array.isArray(checkins)) {

            return [];

        }


        return checkins
            .map(function(item) {

                const mood =
                    item.mood || "Neutral";


                const score =
                    moodScores[mood] || 3;


                const rawDate =
                    item.date ||
                    item.createdAt ||
                    item.timestamp;


                const date =
                    rawDate
                        ? new Date(rawDate)
                        : new Date();


                return {

                    dateObject: date,

                    date:
                        formatShortDate(date),

                    mood:
                        mood,

                    score:
                        score

                };

            })
            .sort(function(a, b) {

                return (
                    a.dateObject -
                    b.dateObject
                );

            });

    }

    catch (error) {

        console.warn(
            "Could not read check-ins.",
            error
        );

        return [];

    }

}


/* =========================================
   OVERALL PROGRESS
========================================= */

function renderOverallProgress() {

    const checkins =
        progressData.checkins;


    const mindfulness =
        progressData.mindfulness;


    const moodBoosters =
        progressData.moodBoosters;


    const journals =
        progressData.journalEntries;


    /*
     * Simple frontend calculation.
     */

    const checkinScore =
        Math.min(
            checkins / 7,
            1
        );


    const mindfulnessScore =
        Math.min(
            mindfulness / 14,
            1
        );


    const boosterScore =
        Math.min(
            moodBoosters / 7,
            1
        );


    const journalScore =
        Math.min(
            journals / 7,
            1
        );


    const overall =
        Math.round(
            (
                checkinScore +
                mindfulnessScore +
                boosterScore +
                journalScore
            ) / 4 * 100
        );


    setText(
        "overallPercentage",
        `${overall}%`
    );


    const progressFill =
        document.getElementById(
            "overallProgressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            `${overall}%`;

    }


    setText(
        "totalCheckins",
        checkins
    );


    setText(
        "mindfulnessCount",
        mindfulness
    );


    setText(
        "moodBoosterCount",
        moodBoosters
    );


    setText(
        "journalCount",
        journals
    );

}


/* =========================================
   MOOD SUMMARY
========================================= */

function renderMoodSummary(
    moodData
) {

    if (
        !moodData ||
        moodData.length === 0
    ) {

        return;

    }


    const scores =
        moodData.map(
            item => item.score
        );


    const latest =
        moodData[
            moodData.length - 1
        ];


    const average =
        calculateAverage(
            scores
        );


    setText(
        "latestMood",
        latest.mood
    );


    setText(
        "averageMood",
        `${average}/5`
    );


    updateMoodTrend(
        moodData
    );

}


/* =========================================
   MOOD TREND
========================================= */

function updateMoodTrend(
    moodData
) {

    const trendElement =
        document.getElementById(
            "moodTrend"
        );


    if (
        !trendElement ||
        moodData.length < 2
    ) {

        if (trendElement) {

            trendElement.textContent =
                "Tracking";

        }

        return;

    }


    const first =
        moodData[0].score;


    const last =
        moodData[
            moodData.length - 1
        ].score;


    if (last > first) {

        trendElement.textContent =
            "Improving";

    }

    else if (last < first) {

        trendElement.textContent =
            "Declining";

    }

    else {

        trendElement.textContent =
            "Stable";

    }

}


/* =========================================
   SINGLE BAR GRAPH
========================================= */

function renderActivityChart() {

    const canvas =
        document.getElementById(
            "activityChart"
        );


    if (!canvas) {

        return;

    }


    if (activityChart) {

        activityChart.destroy();

    }


    const ctx =
        canvas.getContext("2d");


    activityChart =
        new Chart(
            ctx,
            {

                type: "bar",


                data: {

                    labels: [

                        "Check-ins",

                        "Mindfulness",

                        "Mood Boosters",

                        "Journals",

                        "Routines",

                        "Sleep"

                    ],


                    datasets: [

                        {

                            label:
                                "Completed",

                            data: [

                                progressData.checkins,

                                progressData.mindfulness,

                                progressData.moodBoosters,

                                progressData.journalEntries,

                                progressData.routines,

                                progressData.sleepRecords

                            ],


                            backgroundColor:
                                "#7357A8",


                            borderRadius:
                                8,


                            borderSkipped:
                                false,


                            barThickness:
                                32

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            display: false

                        },


                        tooltip: {

                            backgroundColor:
                                "#4B3F72",

                            padding: 10,


                            titleFont: {

                                family:
                                    "Poppins",

                                size: 12

                            },


                            bodyFont: {

                                family:
                                    "Poppins",

                                size: 11

                            }

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,


                            ticks: {

                                precision: 0,


                                font: {

                                    family:
                                        "Poppins",

                                    size: 10

                                },


                                color:
                                    "#77727F"

                            },


                            grid: {

                                color:
                                    "#EEE9F4"

                            }

                        },


                        x: {

                            ticks: {

                                font: {

                                    family:
                                        "Poppins",

                                    size: 10

                                },


                                color:
                                    "#77727F"

                            },


                            grid: {

                                display: false

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================
   ACTIVITY DETAILS
========================================= */

function renderActivityDetails() {

    setText(
        "checkinActivityValue",
        progressData.checkins
    );


    setText(
        "mindfulnessActivityValue",
        progressData.mindfulness
    );


    setText(
        "moodBoosterActivityValue",
        progressData.moodBoosters
    );


    setText(
        "journalActivityValue",
        progressData.journalEntries
    );

}


/* =========================================
   SLEEP & ROUTINE
========================================= */

function renderSleepRoutine() {

    setText(
        "averageSleep",
        `${progressData.averageSleepHours} hrs`
    );


    setText(
        "routinePercentage",
        `${progressData.routineCompletionPercentage}%`
    );

}


/* =========================================
   JOURNAL REFLECTION
========================================= */

function renderReflection() {

    const journal =
        getJournalData();


    /*
     * Do not create fake journal entries.
     */

    if (!journal) {

        return;

    }


    setText(
        "reflectionTitle",
        "Latest journal reflection"
    );


    setText(
        "reflectionText",
        journal.text
    );


    setText(
        "reflectionDate",
        journal.date
    );

}


/* =========================================
   GET JOURNAL DATA
========================================= */

function getJournalData() {

    const possibleKeys = [

        "mindMirrorJournalEntries",

        "journalEntries",

        "journals",

        "journalData"

    ];


    for (
        const key of possibleKeys
    ) {

        try {

            const stored =
                localStorage.getItem(
                    key
                );


            if (!stored) {

                continue;

            }


            const data =
                JSON.parse(stored);


            if (
                Array.isArray(data) &&
                data.length > 0
            ) {

                const latest =
                    data[
                        data.length - 1
                    ];


                const text =
                    latest.text ||
                    latest.content ||
                    latest.entry ||
                    latest.note ||
                    "";


                if (text) {

                    return {

                        text:
                            text,

                        date:
                            formatDateFromItem(
                                latest
                            )

                    };

                }

            }


            if (
                data &&
                typeof data === "object" &&
                !Array.isArray(data)
            ) {

                const text =
                    data.text ||
                    data.content ||
                    data.entry ||
                    data.note ||
                    "";


                if (text) {

                    return {

                        text:
                            text,

                        date:
                            formatDateFromItem(
                                data
                            )

                    };

                }

            }

        }

        catch (error) {

            console.warn(
                `Could not read ${key}`,
                error
            );

        }

    }


    return null;

}


/* =========================================
   LATEST CHECK-IN
========================================= */

function renderLatestCheckin(
    moodData
) {

    if (
        !moodData ||
        moodData.length === 0
    ) {

        return;

    }


    const latest =
        moodData[
            moodData.length - 1
        ];


    const emoji =
        moodEmojis[
            latest.mood
        ] || "🙂";


    setText(
        "latestMoodEmoji",
        emoji
    );


    setText(
        "latestMoodName",
        latest.mood
    );


    setText(
        "latestCheckinDate",
        `${latest.date} · Mood score ${latest.score}/5`
    );

}


/* =========================================
   HIDE PREVIEW MESSAGE
========================================= */

function hidePreviewNotice() {

    const notice =
        document.getElementById(
            "previewNotice"
        );


    if (notice) {

        notice.style.display =
            "none";

    }

}


/* =========================================
   HELPER - SET TEXT
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   HELPER - AVERAGE
========================================= */

function calculateAverage(
    values
) {

    if (
        !values ||
        values.length === 0
    ) {

        return "0.0";

    }


    const total =
        values.reduce(
            function(sum, value) {

                return (
                    sum +
                    Number(value)
                );

            },
            0
        );


    return (
        total /
        values.length
    ).toFixed(1);

}


/* =========================================
   HELPER - SHORT DATE
========================================= */

function formatShortDate(
    date
) {

    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "short"

        }
    );

}


/* =========================================
   HELPER - JOURNAL DATE
========================================= */

function formatDateFromItem(
    item
) {

    const rawDate =
        item.date ||
        item.createdAt ||
        item.timestamp ||
        item.created_at;


    if (!rawDate) {

        return "Recent reflection";

    }


    const date =
        new Date(rawDate);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recent reflection";

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


/* =========================================
   NAVIGATION
========================================= */

function goToDashboard() {

    window.location.href =
        "dashboard.html";

}


function goToMood() {

    window.location.href =
        "mood.html";

}