// ==========================================
// MINDMIRROR AI - LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginMessage = document.getElementById("loginMessage");


    // ==========================================
    // PASSWORD SHOW / HIDE
    // ==========================================

    if (togglePassword) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";
                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";
                togglePassword.textContent = "👁";

            }

        });

    }


    // ==========================================
    // LOGIN
    // ==========================================

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;


            // Check empty fields

            if (username === "" || password === "") {

                loginMessage.textContent =
                    "⚠️ Please enter your username and password.";

                loginMessage.style.color = "#b04a4a";

                return;
            }


            // Get created account

            const savedAccount =
                localStorage.getItem("mindMirrorUser");


            // No account created

            if (!savedAccount) {

                loginMessage.textContent =
                    "⚠️ No account found. Please create an account first.";

                loginMessage.style.color = "#b04a4a";

                return;
            }


            const user =
                JSON.parse(savedAccount);


            // Check username

            if (
                username.toLowerCase() !==
                user.username.toLowerCase()
            ) {

                loginMessage.textContent =
                    "❌ Incorrect username.";

                loginMessage.style.color = "#b04a4a";

                return;
            }


            // Check password

            if (password !== user.password) {

                loginMessage.textContent =
                    "❌ Incorrect password.";

                loginMessage.style.color = "#b04a4a";

                return;
            }


            // ==================================
            // LOGIN SUCCESS
            // ==================================

            loginMessage.textContent =
                "✅ Login successful!";

            loginMessage.style.color = "#5b8a62";


            // Save login status

            localStorage.setItem(
                "mindMirrorLoggedIn",
                "true"
            );


            // Save current user for profile

            localStorage.setItem(
                "mindMirrorProfile",
                JSON.stringify({

                    name: user.fullName,
                    email: user.email,
                    username: user.username

                })
            );


            // Go to Dashboard

            setTimeout(function () {

                window.location.href = "dashboard.html";

            }, 800);

        });

    }

});