// ==========================================
// MINDMIRROR AI - PROFILE
// ==========================================

const nameInput = document.getElementById("profileNameInput");
const emailInput = document.getElementById("profileEmailInput");
const usernameInput = document.getElementById("profileUsernameInput");

const editButton = document.getElementById("editProfile");
const saveButton = document.getElementById("saveProfile");
const cancelButton = document.getElementById("cancelProfile");

const profileMessage = document.getElementById("profileMessage");


// ------------------------------------------
// Load saved profile
// ------------------------------------------

function loadProfile() {

    const savedProfile =
        localStorage.getItem("mindMirrorProfile");

    if (savedProfile) {

        const profile = JSON.parse(savedProfile);

        nameInput.value =
            profile.name || "MindMirror User";

        emailInput.value =
            profile.email || "user@example.com";

        usernameInput.value =
            profile.username || "mindmirror_user";
    }
}


// ------------------------------------------
// Edit Profile
// ------------------------------------------

editButton.addEventListener("click", function () {

    nameInput.disabled = false;
    emailInput.disabled = false;
    usernameInput.disabled = false;

    editButton.style.display = "none";

    saveButton.style.display = "inline-block";
    cancelButton.style.display = "inline-block";

    nameInput.focus();

});


// ------------------------------------------
// Save Profile
// ------------------------------------------

saveButton.addEventListener("click", function () {

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const username = usernameInput.value.trim();


    // Check empty fields

    if (
        name === "" ||
        email === "" ||
        username === ""
    ) {

        profileMessage.textContent =
            "⚠️ Please fill in all fields.";

        return;
    }


    // Save profile

    const profileData = {

        name: name,
        email: email,
        username: username

    };


    localStorage.setItem(
        "mindMirrorProfile",
        JSON.stringify(profileData)
    );


    // Disable inputs

    nameInput.disabled = true;
    emailInput.disabled = true;
    usernameInput.disabled = true;


    // Change buttons

    editButton.style.display = "inline-block";

    saveButton.style.display = "none";
    cancelButton.style.display = "none";


    // Success message

    profileMessage.textContent =
        "✅ Profile updated successfully!";


    setTimeout(function () {

        profileMessage.textContent = "";

    }, 3000);

});


// ------------------------------------------
// Cancel Editing
// ------------------------------------------

cancelButton.addEventListener("click", function () {

    loadProfile();

    nameInput.disabled = true;
    emailInput.disabled = true;
    usernameInput.disabled = true;


    editButton.style.display = "inline-block";

    saveButton.style.display = "none";
    cancelButton.style.display = "none";

    profileMessage.textContent = "";

});


// ------------------------------------------
// Load profile when page opens
// ------------------------------------------

loadProfile();