/* =========================================================
   MindMirror - VR Relaxation
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const environmentCards =
            document.querySelectorAll(
                ".environment-card"
            );

        const downloadVRButton =
            document.getElementById(
                "downloadVRButton"
            );

        const downloadModal =
            document.getElementById(
                "downloadModal"
            );

        const modalCloseButton =
            document.getElementById(
                "modalCloseButton"
            );

        const apkDownloadButton =
            document.getElementById(
                "apkDownloadButton"
            );

        const downloadTitle =
            document.getElementById(
                "downloadTitle"
            );

        const downloadDescription =
            document.getElementById(
                "downloadDescription"
            );

        const modalIcon =
            document.getElementById(
                "modalIcon"
            );


        /* =====================================================
           SELECTED ENVIRONMENT
        ===================================================== */

        let selectedEnvironment = "";

        let selectedAPK = "";

        let selectedIcon = "🥽";


        /* =====================================================
           OPEN DOWNLOAD MODAL
        ===================================================== */

        function openDownloadModal(
            environment,
            apk,
            icon
        ) {

            selectedEnvironment =
                environment;

            selectedAPK =
                apk;

            selectedIcon =
                icon || "🥽";


            /* Update modal */

            modalIcon.textContent =
                selectedIcon;

            downloadTitle.textContent =
                selectedEnvironment;

            downloadDescription.textContent =
                "Download the " +
                selectedEnvironment +
                " MindMirror VR Android application " +
                "and experience the environment using " +
                "your phone VR headset.";


            /* Set APK */

            apkDownloadButton.href =
                selectedAPK;

            apkDownloadButton.setAttribute(
                "download",
                ""
            );


            /* Show modal */

            downloadModal.classList.add(
                "show"
            );

            downloadModal.setAttribute(
                "aria-hidden",
                "false"
            );


            /* Prevent background scrolling */

            document.body.style.overflow =
                "hidden";


            /* Focus close button */

            setTimeout(
                function () {

                    modalCloseButton.focus();

                },
                100
            );
        }


        /* =====================================================
           CLOSE DOWNLOAD MODAL
        ===================================================== */

        function closeDownloadModal() {

            downloadModal.classList.remove(
                "show"
            );

            downloadModal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow =
                "";


            selectedEnvironment =
                "";

            selectedAPK =
                "";

            selectedIcon =
                "🥽";
        }


        /* =====================================================
           ENVIRONMENT CARD CLICK
        ===================================================== */

        environmentCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        const environment =
                            card.dataset.environment;

                        const apk =
                            card.dataset.apk;

                        const icon =
                            card.dataset.icon;


                        if (!environment || !apk) {

                            console.error(
                                "VR environment information is missing."
                            );

                            return;
                        }


                        openDownloadModal(
                            environment,
                            apk,
                            icon
                        );

                    }
                );


                /* =================================================
                   KEYBOARD ACCESS
                ================================================= */

                card.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            card.click();

                        }

                    }
                );

            }
        );


        /* =====================================================
           CHOOSE VR ENVIRONMENT BUTTON
        ===================================================== */

        if (downloadVRButton) {

            downloadVRButton.addEventListener(
                "click",
                function () {

                    const firstCard =
                        document.querySelector(
                            ".environment-card"
                        );


                    if (firstCard) {

                        const environment =
                            firstCard.dataset.environment;

                        const apk =
                            firstCard.dataset.apk;

                        const icon =
                            firstCard.dataset.icon;


                        openDownloadModal(
                            environment,
                            apk,
                            icon
                        );

                    }

                }
            );

        }


        /* =====================================================
           CLOSE BUTTON
        ===================================================== */

        modalCloseButton.addEventListener(
            "click",
            closeDownloadModal
        );


        /* =====================================================
           CLICK OUTSIDE MODAL
        ===================================================== */

        downloadModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    downloadModal
                ) {

                    closeDownloadModal();

                }

            }
        );


        /* =====================================================
           ESCAPE KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    downloadModal.classList.contains(
                        "show"
                    )
                ) {

                    closeDownloadModal();

                }

            }
        );


        /* =====================================================
           APK DOWNLOAD CHECK
        ===================================================== */

        apkDownloadButton.addEventListener(
            "click",
            function (event) {

                if (!selectedAPK) {

                    event.preventDefault();

                    alert(
                        "Please select a VR environment first."
                    );

                    return;
                }


                console.log(
                    "Downloading:",
                    selectedEnvironment
                );

                console.log(
                    "APK:",
                    selectedAPK
                );

            }
        );


        /* =====================================================
           PREVENT BROKEN APK PATHS
        ===================================================== */

        environmentCards.forEach(
            function (card) {

                const apk =
                    card.dataset.apk;

                if (!apk) {

                    console.warn(
                        "Missing APK path:",
                        card
                    );

                }

            }
        );


    }
);