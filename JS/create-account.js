// ==========================================
// MindMirror AI - Create Account
// ==========================================

const createAccountForm =
    document.getElementById("createAccountForm");

const createMessage =
    document.getElementById("createMessage");

const toggleNewPassword =
    document.getElementById("toggleNewPassword");

const newPassword =
    document.getElementById("newPassword");


// Show / Hide password

if (toggleNewPassword && newPassword) {

    toggleNewPassword.addEventListener("click", function () {

        if (newPassword.type === "password") {

            newPassword.type = "text";
            toggleNewPassword.textContent = "🙈";

        } else {

            newPassword.type = "password";
            toggleNewPassword.textContent = "👁";

        }

    });

}


// Create Account

if (createAccountForm) {

    createAccountForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const username =
            document.getElementById("newUsername").value.trim();

        const password =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (password.length < 6) {

            createMessage.textContent =
                "⚠️ Password must contain at least 6 characters.";

            return;
        }


        if (password !== confirmPassword) {

            createMessage.textContent =
                "⚠️ Passwords do not match.";

            return;
        }


        // Save complete account

        const userData = {

            fullName: fullName,
            email: email,
            username: username,
            password: password

        };


        localStorage.setItem(
            "mindMirrorUser",
            JSON.stringify(userData)
        );


        // IMPORTANT:
        // Login also checks this key

        localStorage.setItem(
            "mindMirrorPassword",
            password
        );


        createMessage.textContent =
            "✅ Account created successfully!";


        setTimeout(function () {

            window.location.href = "index.html";

        }, 1200);

    });

}