const forgotForm = document.getElementById("forgotForm");
const forgotMessage = document.getElementById("forgotMessage");

if (forgotForm) {

    forgotForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const enteredUser =
            document.getElementById("forgotUser").value.trim();

        if (enteredUser === "") {
            forgotMessage.textContent =
                "⚠️ Please enter your username or email.";

            return;
        }

        const savedUser =
            JSON.parse(localStorage.getItem("mindMirrorUser"));

        if (!savedUser) {

            forgotMessage.textContent =
                "⚠️ No account found. Please create an account first.";

            return;
        }

        const usernameMatch =
            enteredUser.toLowerCase() ===
            savedUser.username.toLowerCase();

        const emailMatch =
            enteredUser.toLowerCase() ===
            savedUser.email.toLowerCase();

        if (usernameMatch || emailMatch) {

            forgotMessage.textContent =
                "✅ Account found! You can now reset your password.";

            setTimeout(function () {

                window.location.href =
                    "reset-password.html";

            }, 1200);

        } else {

            forgotMessage.textContent =
                "❌ We couldn't find an account with those details.";

        }

    });

}