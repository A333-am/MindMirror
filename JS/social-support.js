/* =========================================================
   MINDMIRROR - SOCIAL SUPPORT
   FRONTEND
   ========================================================= */


/* ================= STORAGE ================= */

const PEOPLE_KEY =
    "mindmirrorSupportCircle";

const HISTORY_KEY =
    "mindmirrorSocialSupportHistory";


/* ================= STATE ================= */

let selectedFeeling = null;

let selectedPerson = null;

let selectedStatus = null;

let selectedFollowUp = null;


/* ================= DOM ================= */

const dashboardBtn =
    document.getElementById("dashboardBtn");

const feelingOptions =
    document.querySelectorAll(".feeling-option");

const peopleSection =
    document.getElementById("peopleSection");

const peopleList =
    document.getElementById("peopleList");

const addPersonBtn =
    document.getElementById("addPersonBtn");

const noPeopleMessage =
    document.getElementById("noPeopleMessage");

const reachOutSection =
    document.getElementById("reachOutSection");

const selectedPersonName =
    document.getElementById("selectedPersonName");

const selectedPersonRelationship =
    document.getElementById("selectedPersonRelationship");

const selectedPersonAvatar =
    document.getElementById("selectedPersonAvatar");

const supportMessage =
    document.getElementById("supportMessage");

const editMessageBtn =
    document.getElementById("editMessageBtn");

const callBtn =
    document.getElementById("callBtn");

const messageBtn =
    document.getElementById("messageBtn");

const whatsappBtn =
    document.getElementById("whatsappBtn");

const copyMessageBtn =
    document.getElementById("copyMessageBtn");

const statusSection =
    document.getElementById("statusSection");

const statusOptions =
    document.querySelectorAll(".status-option");

const saveActionBtn =
    document.getElementById("saveActionBtn");

const followUpSection =
    document.getElementById("followUpSection");

const followUpOptions =
    document.querySelectorAll(
        ".followup-options button"
    );

const historyList =
    document.getElementById("historyList");


/* ================= MODAL ================= */

const personModal =
    document.getElementById("personModal");

const closePersonModal =
    document.getElementById(
        "closePersonModal"
    );

const personName =
    document.getElementById("personName");

const personRelationship =
    document.getElementById(
        "personRelationship"
    );

const personPhone =
    document.getElementById(
        "personPhone"
    );

const preferredMethod =
    document.getElementById(
        "preferredMethod"
    );

const savePersonBtn =
    document.getElementById(
        "savePersonBtn"
    );


/* ================= TOAST ================= */

const toast =
    document.getElementById("toast");

let toastTimer = null;


/* =========================================================
   DASHBOARD
   ========================================================= */

dashboardBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "dashboard.html";

    }
);


/* =========================================================
   FEELING SELECTION
   ========================================================= */

feelingOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            feelingOptions.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            option.classList.add(
                "selected"
            );


            selectedFeeling =
                option.dataset.feeling;


            showPeopleSection();

        }
    );

});


/* =========================================================
   SHOW PEOPLE
   ========================================================= */

function showPeopleSection() {

    peopleSection.classList.remove(
        "hidden"
    );


    renderPeople();


    peopleSection.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* =========================================================
   PEOPLE STORAGE
   ========================================================= */

function getPeople() {

    try {

        const data =
            localStorage.getItem(
                PEOPLE_KEY
            );


        if (!data) {

            return [];

        }


        const people =
            JSON.parse(data);


        return Array.isArray(people)
            ? people
            : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function savePeople(people) {

    localStorage.setItem(

        PEOPLE_KEY,

        JSON.stringify(people)

    );

}


/* =========================================================
   RENDER PEOPLE
   ========================================================= */

function renderPeople() {

    const people =
        getPeople();


    peopleList.innerHTML = "";


    if (people.length === 0) {

        noPeopleMessage.classList.remove(
            "hidden"
        );

        return;

    }


    noPeopleMessage.classList.add(
        "hidden"
    );


    people.forEach(person => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "person-card";


        card.innerHTML = `

            <div class="person-avatar">
                👤
            </div>

            <div class="person-info">

                <h3>
                    ${escapeHtml(
                        person.name
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        person.relationship
                    )}
                </p>

            </div>

            <button
                type="button"
                class="person-select"
            >
                Reach Out
            </button>

            <button
                type="button"
                class="delete-person"
                title="Delete person"
            >
                ×
            </button>

        `;


        const selectButton =
            card.querySelector(
                ".person-select"
            );


        const deleteButton =
            card.querySelector(
                ".delete-person"
            );


        selectButton.addEventListener(
            "click",
            () => {

                selectPerson(person);

            }
        );


        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deletePerson(
                    person.id
                );

            }
        );


        peopleList.appendChild(card);

    });

}


/* =========================================================
   ADD PERSON
   ========================================================= */

addPersonBtn.addEventListener(
    "click",
    () => {

        personModal.classList.remove(
            "hidden"
        );

        personName.focus();

    }
);


closePersonModal.addEventListener(
    "click",
    closePersonModalWindow
);


personModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            personModal
        ) {

            closePersonModalWindow();

        }

    }
);


function closePersonModalWindow() {

    personModal.classList.add(
        "hidden"
    );

    clearPersonForm();

}


/* =========================================================
   SAVE PERSON
   ========================================================= */

savePersonBtn.addEventListener(
    "click",
    savePerson
);


function savePerson() {

    const name =
        personName.value.trim();

    const relationship =
        personRelationship.value.trim();

    const phone =
        personPhone.value.trim();

    const method =
        preferredMethod.value;


    if (!name) {

        showToast(
            "Please enter their name."
        );

        personName.focus();

        return;

    }


    if (!relationship) {

        showToast(
            "Please enter the relationship."
        );

        personRelationship.focus();

        return;

    }


    if (!phone) {

        showToast(
            "Please enter a phone number."
        );

        personPhone.focus();

        return;

    }


    const people =
        getPeople();


    const person = {

        id:
            Date.now().toString(),

        name:
            name,

        relationship:
            relationship,

        phone:
            phone,

        preferredMethod:
            method

    };


    people.push(person);


    savePeople(people);


    closePersonModalWindow();


    renderPeople();


    showToast(
        `${name} was added to your support circle.`
    );

}


/* =========================================================
   CLEAR PERSON FORM
   ========================================================= */

function clearPersonForm() {

    personName.value = "";

    personRelationship.value = "";

    personPhone.value = "";

    preferredMethod.value =
        "call";

}


/* =========================================================
   DELETE PERSON
   ========================================================= */

function deletePerson(id) {

    const confirmed =
        window.confirm(
            "Remove this person from your support circle?"
        );


    if (!confirmed) {

        return;

    }


    const people =
        getPeople();


    const updated =
        people.filter(
            person =>
                person.id !== id
        );


    savePeople(updated);


    if (
        selectedPerson &&
        selectedPerson.id === id
    ) {

        selectedPerson = null;

        reachOutSection.classList.add(
            "hidden"
        );

        statusSection.classList.add(
            "hidden"
        );

        followUpSection.classList.add(
            "hidden"
        );

    }


    renderPeople();


    showToast(
        "Person removed."
    );

}


/* =========================================================
   SELECT PERSON
   ========================================================= */

function selectPerson(person) {

    selectedPerson =
        person;


    selectedPersonName.textContent =
        person.name;


    selectedPersonRelationship.textContent =
        person.relationship;


    selectedPersonAvatar.textContent =
        getPersonEmoji(
            person.relationship
        );


    supportMessage.value =
        createSuggestedMessage(
            selectedFeeling,
            person.name
        );


    supportMessage.readOnly =
        true;


    supportMessage.classList.remove(
        "editable"
    );


    reachOutSection.classList.remove(
        "hidden"
    );


    statusSection.classList.remove(
        "hidden"
    );


    selectedStatus = null;


    statusOptions.forEach(option => {

        option.classList.remove(
            "selected"
        );

    });


    followUpSection.classList.add(
        "hidden"
    );


    reachOutSection.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/* =========================================================
   PERSON EMOJI
   ========================================================= */

function getPersonEmoji(
    relationship
) {

    const value =
        relationship.toLowerCase();


    if (
        value.includes("mother") ||
        value.includes("mom") ||
        value.includes("mum")
    ) {

        return "👩";

    }


    if (
        value.includes("father") ||
        value.includes("dad")
    ) {

        return "👨";

    }


    if (
        value.includes("sister") ||
        value.includes("brother") ||
        value.includes("sibling")
    ) {

        return "🧑";

    }


    if (
        value.includes("friend")
    ) {

        return "🧑‍🤝‍🧑";

    }


    return "👤";

}


/* =========================================================
   SUGGESTED MESSAGE
   ========================================================= */

function createSuggestedMessage(
    feeling,
    name
) {

    const messages = {

        "Lonely":
            `Hi ${name}, I've been feeling a little lonely today. Could we talk for a few minutes?`,

        "Worried":
            `Hi ${name}, I'm feeling a bit worried today. I could really use someone to talk to.`,

        "Low":
            `Hi ${name}, I'm having a difficult day and I'm feeling a little low. Could we talk?`,

        "Overwhelmed":
            `Hi ${name}, I'm feeling a little overwhelmed right now. Could you stay with me or talk for a while?`,

        "Need someone":
            `Hi ${name}, I'm not feeling okay right now. Could we talk for a few minutes?`

    };


    return (
        messages[feeling] ||
        `Hi ${name}, I'm having a difficult day. Could we talk for a few minutes?`
    );

}


/* =========================================================
   EDIT MESSAGE
   ========================================================= */

editMessageBtn.addEventListener(
    "click",
    () => {

        if (
            supportMessage.readOnly
        ) {

            supportMessage.readOnly =
                false;

            supportMessage.classList.add(
                "editable"
            );

            supportMessage.focus();

            editMessageBtn.textContent =
                "Done";

        } else {

            supportMessage.readOnly =
                true;

            supportMessage.classList.remove(
                "editable"
            );

            editMessageBtn.textContent =
                "Edit";

        }

    }
);


/* =========================================================
   CALL
   ========================================================= */

callBtn.addEventListener(
    "click",
    () => {

        if (!selectedPerson) {

            return;

        }


        /*
            Opens the phone's calling interface.

            The user still has to confirm the call.
        */

        window.location.href =
            `tel:${cleanPhoneNumber(
                selectedPerson.phone
            )}`;


        showToast(
            `Calling ${selectedPerson.name}...`
        );

    }
);


/* =========================================================
   SMS
   ========================================================= */

messageBtn.addEventListener(
    "click",
    () => {

        if (!selectedPerson) {

            return;

        }


        const message =
            supportMessage.value;


        const phone =
            cleanPhoneNumber(
                selectedPerson.phone
            );


        window.location.href =
            `sms:${phone}?body=${encodeURIComponent(
                message
            )}`;

    }
);


/* =========================================================
   WHATSAPP
   ========================================================= */

whatsappBtn.addEventListener(
    "click",
    () => {

        if (!selectedPerson) {

            return;

        }


        const message =
            supportMessage.value;


        const phone =
            cleanPhoneNumber(
                selectedPerson.phone
            );


        /*
            WhatsApp requires the number
            with country code.

            Example:
            919876543210
        */

        window.open(

            `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`,

            "_blank"

        );

    }
);


/* =========================================================
   CLEAN PHONE NUMBER
   ========================================================= */

function cleanPhoneNumber(phone) {

    return String(phone)
        .replace(/[^\d+]/g, "")
        .replace("+", "");

}


/* =========================================================
   COPY MESSAGE
   ========================================================= */

copyMessageBtn.addEventListener(
    "click",
    async () => {

        const message =
            supportMessage.value;


        try {

            await navigator.clipboard.writeText(
                message
            );


            showToast(
                "Message copied."
            );

        } catch (error) {

            supportMessage.select();

            document.execCommand(
                "copy"
            );


            showToast(
                "Message copied."
            );

        }

    }
);


/* =========================================================
   STATUS
   ========================================================= */

statusOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            statusOptions.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            option.classList.add(
                "selected"
            );


            selectedStatus =
                option.dataset.status;


            /*
                If they connected,
                ask a follow-up question.
            */

            if (
                selectedStatus ===
                "connected"
            ) {

                followUpSection.classList.remove(
                    "hidden"
                );

            } else {

                followUpSection.classList.add(
                    "hidden"
                );

                selectedFollowUp =
                    null;

            }

        }
    );

});


/* =========================================================
   FOLLOW UP
   ========================================================= */

followUpOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            followUpOptions.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            option.classList.add(
                "selected"
            );


            selectedFollowUp =
                option.dataset.feeling;


            showToast(
                "Thank you for checking in with yourself."
            );

        }
    );

});


/* =========================================================
   SAVE SUPPORT ACTION
   ========================================================= */

saveActionBtn.addEventListener(
    "click",
    saveSupportAction
);


function saveSupportAction() {

    if (!selectedPerson) {

        showToast(
            "Please choose someone to reach out to."
        );

        return;

    }


    if (!selectedStatus) {

        showToast(
            "Please choose what happened."
        );

        return;

    }


    if (
        selectedStatus ===
        "connected" &&
        !selectedFollowUp
    ) {

        showToast(
            "Please choose how you feel now."
        );

        return;

    }


    const history =
        getHistory();


    const record = {

        id:
            Date.now().toString(),

        feeling:
            selectedFeeling,

        personName:
            selectedPerson.name,

        relationship:
            selectedPerson.relationship,

        supportType:
            "Personal connection",

        message:
            supportMessage.value,

        contactStatus:
            selectedStatus,

        followUpFeeling:
            selectedFollowUp,

        createdAt:
            new Date().toISOString()

    };


    history.unshift(
        record
    );


    saveHistory(
        history
    );


    renderHistory();


    showToast(
        "Your support action was saved."
    );


    resetCurrentAction();

}


/* =========================================================
   RESET
   ========================================================= */

function resetCurrentAction() {

    selectedPerson = null;

    selectedStatus = null;

    selectedFollowUp = null;


    reachOutSection.classList.add(
        "hidden"
    );


    statusSection.classList.add(
        "hidden"
    );


    followUpSection.classList.add(
        "hidden"
    );


    statusOptions.forEach(option => {

        option.classList.remove(
            "selected"
        );

    });


    followUpOptions.forEach(option => {

        option.classList.remove(
            "selected"
        );

    });

}


/* =========================================================
   HISTORY STORAGE
   ========================================================= */

function getHistory() {

    try {

        const data =
            localStorage.getItem(
                HISTORY_KEY
            );


        if (!data) {

            return [];

        }


        const history =
            JSON.parse(data);


        return Array.isArray(history)
            ? history
            : [];

    } catch (error) {

        console.error(error);

        return [];

    }

}


function saveHistory(history) {

    localStorage.setItem(

        HISTORY_KEY,

        JSON.stringify(history)

    );

}


/* =========================================================
   RENDER HISTORY
   ========================================================= */

function renderHistory() {

    const history =
        getHistory();


    historyList.innerHTML = "";


    if (!history.length) {

        historyList.innerHTML = `

            <div class="history-item">

                <div class="history-person">
                    No support actions yet
                </div>

                <p class="history-info">
                    When you reach out to someone,
                    your support actions will appear here.
                </p>

            </div>

        `;

        return;

    }


    history.forEach(record => {

        const item =
            document.createElement(
                "article"
            );


        item.className =
            "history-item";


        const statusText =
            getStatusText(
                record.contactStatus
            );


        const statusClass =
            record.contactStatus ===
            "connected"
                ? "connected"
                : "";


        const followUp =
            record.followUpFeeling
                ? `
                    <div class="history-followup">
                        After reaching out:
                        ${escapeHtml(
                            record.followUpFeeling
                        )}
                    </div>
                `
                : "";


        item.innerHTML = `

            <div class="history-top">

                <div class="history-person">

                    ${escapeHtml(
                        record.personName
                    )}

                </div>

                <div class="history-date">

                    ${formatDate(
                        record.createdAt
                    )}

                </div>

            </div>


            <p class="history-info">

                You were feeling
                <strong>
                    ${escapeHtml(
                        record.feeling
                    )}
                </strong>

                and reached out to your
                <strong>
                    ${escapeHtml(
                        record.relationship
                    )}
                </strong>.

            </p>


            <span class="history-status ${statusClass}">

                ${statusText}

            </span>


            ${followUp}

        `;


        historyList.appendChild(
            item
        );

    });

}


/* =========================================================
   STATUS TEXT
   ========================================================= */

function getStatusText(status) {

    switch (status) {

        case "reached_out":
            return "💌 Reached out";

        case "connected":
            return "💜 Connected";

        case "still_need_support":
            return "🫂 Still need support";

        default:
            return "Support action";

    }

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(value) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "numeric",

            month: "short",

            year: "numeric"

        }
    );

}


/* =========================================================
   HTML SAFETY
   ========================================================= */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

renderPeople();

renderHistory();