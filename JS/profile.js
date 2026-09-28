// ==========================================
// MINDMIRROR - PROFILE
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const nameInput =
    document.getElementById("profileNameInput");

const emailInput =
    document.getElementById("profileEmailInput");

const usernameInput =
    document.getElementById("profileUsernameInput");

const editButton =
    document.getElementById("editProfile");

const saveButton =
    document.getElementById("saveProfile");

const cancelButton =
    document.getElementById("cancelProfile");

const profileMessage =
    document.getElementById("profileMessage");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileDisplayName =
    document.getElementById("profileDisplayName");

const profileDisplayUsername =
    document.getElementById("profileDisplayUsername");

const completionPercentage =
    document.getElementById("completionPercentage");

const profileProgress =
    document.getElementById("profileProgress");

const memberSince =
    document.getElementById("memberSince");

const lastUpdated =
    document.getElementById("lastUpdated");

const logoutButton =
    document.getElementById("logoutButton");

const logoutModal =
    document.getElementById("logoutModal");

const cancelLogout =
    document.getElementById("cancelLogout");

const confirmLogout =
    document.getElementById("confirmLogout");


// Error elements

const nameError =
    document.getElementById("nameError");

const emailError =
    document.getElementById("emailError");

const usernameError =
    document.getElementById("usernameError");


// ==========================================
// STORAGE KEY
// ==========================================

const PROFILE_STORAGE_KEY =
    "mindMirrorProfile";

const PROFILE_META_KEY =
    "mindMirrorProfileMeta";


// ==========================================
// DEFAULT PROFILE
// ==========================================

const defaultProfile = {

    name: "MindMirror User",

    email: "user@example.com",

    username: "mindmirror_user"

};


// ==========================================
// TEMPORARY EDIT BACKUP
// ==========================================

let originalProfile = null;


// ==========================================
// GET PROFILE
// ==========================================

function getSavedProfile() {

    const savedProfile =
        localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!savedProfile) {

        return {
            ...defaultProfile
        };

    }

    try {

        const profile =
            JSON.parse(savedProfile);

        return {

            name:
                profile.name ||
                defaultProfile.name,

            email:
                profile.email ||
                defaultProfile.email,

            username:
                profile.username ||
                defaultProfile.username

        };

    } catch (error) {

        console.error(
            "Unable to read saved profile:",
            error
        );

        return {
            ...defaultProfile
        };
    }
}


// ==========================================
// LOAD PROFILE
// ==========================================

function loadProfile() {

    const profile =
        getSavedProfile();

    nameInput.value =
        profile.name;

    emailInput.value =
        profile.email;

    usernameInput.value =
        profile.username;


    updateProfileDisplay(profile);

    updateProfileCompletion(profile);

    loadProfileMeta();

    clearValidationErrors();
}


// ==========================================
// UPDATE PROFILE DISPLAY
// ==========================================

function updateProfileDisplay(profile) {

    profileDisplayName.textContent =
        profile.name;

    profileDisplayUsername.textContent =
        "@" + profile.username;


    // Create initials

    const initials =
        getInitials(profile.name);

    profileAvatar.textContent =
        initials;
}


// ==========================================
// GET INITIALS
// ==========================================

function getInitials(name) {

    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (words.length === 0) {

        return "MM";
    }


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();
    }


    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}


// ==========================================
// PROFILE COMPLETION
// ==========================================

function updateProfileCompletion(profile) {

    const fields = [

        profile.name,

        profile.email,

        profile.username

    ];


    const completed =
        fields.filter(
            field =>
                field &&
                field.trim() !== ""
        ).length;


    const percentage =
        Math.round(
            (completed / fields.length) * 100
        );


    completionPercentage.textContent =
        percentage + "%";

    profileProgress.style.width =
        percentage + "%";
}


// ==========================================
// PROFILE META
// ==========================================

function loadProfileMeta() {

    const savedMeta =
        localStorage.getItem(PROFILE_META_KEY);


    if (!savedMeta) {

        const today =
            new Date();

        memberSince.textContent =
            formatDate(today);

        lastUpdated.textContent =
            "Not updated yet";

        return;
    }


    try {

        const meta =
            JSON.parse(savedMeta);


        if (meta.memberSince) {

            memberSince.textContent =
                formatDate(
                    new Date(meta.memberSince)
                );
        }


        if (meta.lastUpdated) {

            lastUpdated.textContent =
                formatDateTime(
                    new Date(meta.lastUpdated)
                );
        }

    } catch (error) {

        console.error(
            "Unable to read profile metadata:",
            error
        );
    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime())
    ) {

        return "Today";
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


// ==========================================
// FORMAT DATE + TIME
// ==========================================

function formatDateTime(date) {

    if (
        !(date instanceof Date) ||
        Number.isNaN(date.getTime())
    ) {

        return "Not available";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    ) + " • " +
    date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


// ==========================================
// ENABLE EDIT MODE
// ==========================================

editButton.addEventListener(
    "click",
    function () {

        originalProfile =
            getSavedProfile();


        nameInput.disabled = false;

        emailInput.disabled = false;

        usernameInput.disabled = false;


        editButton.hidden = true;

        saveButton.hidden = false;

        cancelButton.hidden = false;


        clearMessage();

        clearValidationErrors();


        nameInput.focus();

    }
);


// ==========================================
// SAVE PROFILE
// ==========================================

saveButton.addEventListener(
    "click",
    function () {

        clearValidationErrors();


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const username =
            usernameInput.value.trim();


        const isValid =
            validateProfile(
                name,
                email,
                username
            );


        if (!isValid) {

            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            return;
        }


        const profileData = {

            name: name,

            email: email,

            username: username

        };


        // Save profile

        localStorage.setItem(
            PROFILE_STORAGE_KEY,
            JSON.stringify(profileData)
        );


        // Save metadata

        const existingMeta =
            getProfileMeta();


        const now =
            new Date();


        const meta = {

            memberSince:
                existingMeta.memberSince ||
                now.toISOString(),

            lastUpdated:
                now.toISOString()

        };


        localStorage.setItem(
            PROFILE_META_KEY,
            JSON.stringify(meta)
        );


        // Update UI

        updateProfileDisplay(
            profileData
        );

        updateProfileCompletion(
            profileData
        );

        loadProfileMeta();


        disableEditMode();


        showMessage(
            "✓ Profile updated successfully!",
            "success"
        );


        setTimeout(
            clearMessage,
            3500
        );

    }
);


// ==========================================
// VALIDATE PROFILE
// ==========================================

function validateProfile(
    name,
    email,
    username
) {

    let valid = true;


    // Name

    if (name.length < 2) {

        nameError.textContent =
            "Please enter at least 2 characters.";

        nameInput.classList.add(
            "input-error"
        );

        valid = false;

    }


    // Email

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        emailInput.classList.add(
            "input-error"
        );

        valid = false;

    }


    // Username

    const usernamePattern =
        /^[a-zA-Z0-9._-]+$/;


    if (username.length < 3) {

        usernameError.textContent =
            "Username must contain at least 3 characters.";

        usernameInput.classList.add(
            "input-error"
        );

        valid = false;

    } else if (
        !usernamePattern.test(username)
    ) {

        usernameError.textContent =
            "Use only letters, numbers, dots, underscores or hyphens.";

        usernameInput.classList.add(
            "input-error"
        );

        valid = false;

    }


    return valid;
}


// ==========================================
// CANCEL EDITING
// ==========================================

cancelButton.addEventListener(
    "click",
    function () {

        if (originalProfile) {

            nameInput.value =
                originalProfile.name;

            emailInput.value =
                originalProfile.email;

            usernameInput.value =
                originalProfile.username;

        } else {

            loadProfile();

        }


        clearValidationErrors();

        disableEditMode();

        clearMessage();

    }
);


// ==========================================
// DISABLE EDIT MODE
// ==========================================

function disableEditMode() {

    nameInput.disabled = true;

    emailInput.disabled = true;

    usernameInput.disabled = true;


    editButton.hidden = false;

    saveButton.hidden = true;

    cancelButton.hidden = true;


    originalProfile = null;
}


// ==========================================
// VALIDATION CLEAR
// ==========================================

function clearValidationErrors() {

    nameError.textContent = "";

    emailError.textContent = "";

    usernameError.textContent = "";


    nameInput.classList.remove(
        "input-error"
    );

    emailInput.classList.remove(
        "input-error"
    );

    usernameInput.classList.remove(
        "input-error"
    );
}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
    message,
    type
) {

    profileMessage.textContent =
        message;

    profileMessage.className =
        "profile-message " + type;
}


function clearMessage() {

    profileMessage.textContent = "";

    profileMessage.className =
        "profile-message";
}


// ==========================================
// PROFILE META HELPER
// ==========================================

function getProfileMeta() {

    const savedMeta =
        localStorage.getItem(
            PROFILE_META_KEY
        );


    if (!savedMeta) {

        return {};
    }


    try {

        return JSON.parse(
            savedMeta
        );

    } catch (error) {

        return {};
    }
}


// ==========================================
// LOGOUT MODAL
// ==========================================

logoutButton.addEventListener(
    "click",
    function () {

        logoutModal.hidden = false;

    }
);


// ==========================================
// CANCEL LOGOUT
// ==========================================

cancelLogout.addEventListener(
    "click",
    function () {

        logoutModal.hidden = true;

    }
);


// ==========================================
// CONFIRM LOGOUT
// ==========================================

confirmLogout.addEventListener(
    "click",
    function () {

        /*
         * Do not delete the profile information here.
         *
         * The current frontend version uses localStorage
         * for profile persistence.
         *
         * When your real authentication system is connected,
         * replace this section with your backend logout.
         */

        localStorage.removeItem(
            "mindMirrorLoggedIn"
        );

        window.location.href =
            "index.html";

    }
);


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

logoutModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === logoutModal
        ) {

            logoutModal.hidden = true;
        }

    }
);


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !logoutModal.hidden
        ) {

            logoutModal.hidden = true;
        }

    }
);


// ==========================================
// INPUT VALIDATION WHILE TYPING
// ==========================================

nameInput.addEventListener(
    "input",
    function () {

        nameError.textContent = "";

        nameInput.classList.remove(
            "input-error"
        );

    }
);


emailInput.addEventListener(
    "input",
    function () {

        emailError.textContent = "";

        emailInput.classList.remove(
            "input-error"
        );

    }
);


usernameInput.addEventListener(
    "input",
    function () {

        usernameError.textContent = "";

        usernameInput.classList.remove(
            "input-error"
        );

    }
);


// ==========================================
// PREVENT ACCIDENTAL DATA LOSS
// ==========================================

window.addEventListener(
    "beforeunload",
    function (event) {

        if (
            !saveButton.hidden &&
            hasUnsavedChanges()
        ) {

            event.preventDefault();

            event.returnValue = "";

        }

    }
);


// ==========================================
// CHECK UNSAVED CHANGES
// ==========================================

function hasUnsavedChanges() {

    if (!originalProfile) {

        return false;
    }


    return (
        nameInput.value.trim() !==
            originalProfile.name ||

        emailInput.value.trim() !==
            originalProfile.email ||

        usernameInput.value.trim() !==
            originalProfile.username
    );
}


// ==========================================
// INITIALIZE PROFILE
// ==========================================

loadProfile();