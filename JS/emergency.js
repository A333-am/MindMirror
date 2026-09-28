document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const safeBtn = document.getElementById("safeBtn");
    const helpBtn = document.getElementById("helpBtn");
    const safetyMessage = document.getElementById("safetyMessage");


    /* Voice */

    const startVoiceBtn =
        document.getElementById("startVoiceBtn");

    const stopVoiceBtn =
        document.getElementById("stopVoiceBtn");

    const voiceStatus =
        document.getElementById("voiceStatus");

    const voiceStatusText =
        document.getElementById("voiceStatusText");

    const transcriptText =
        document.getElementById("transcriptText");

    const emergencyAlert =
        document.getElementById("emergencyAlert");

    const emergencyAlertText =
        document.getElementById("emergencyAlertText");


    /* Location */

    const requestLocationBtn =
        document.getElementById("requestLocationBtn");

    const browserLocationBtn =
        document.getElementById("browserLocationBtn");

    const mapBtn =
        document.getElementById("mapBtn");

    const latitudeValue =
        document.getElementById("latitudeValue");

    const longitudeValue =
        document.getElementById("longitudeValue");

    const locationStatus =
        document.getElementById("locationStatus");

    const locationStatusText =
        document.getElementById("locationStatusText");


    /* Location modals */

    const locationConsentModal =
        document.getElementById("locationConsentModal");

    const locationConfirmModal =
        document.getElementById("locationConfirmModal");

    const cancelLocationBtn =
        document.getElementById("cancelLocationBtn");

    const continueLocationBtn =
        document.getElementById("continueLocationBtn");

    const cancelLocationConfirmBtn =
        document.getElementById("cancelLocationConfirmBtn");

    const confirmLocationBtn =
        document.getElementById("confirmLocationBtn");


    /* Calls */

    const contactCallBtn =
        document.getElementById("contactCallBtn");

    const emergencyServicesBtn =
        document.getElementById("emergencyServicesBtn");

    const callModal =
        document.getElementById("callModal");

    const callModalTitle =
        document.getElementById("callModalTitle");

    const callModalText =
        document.getElementById("callModalText");

    const cancelCallBtn =
        document.getElementById("cancelCallBtn");

    const confirmCallBtn =
        document.getElementById("confirmCallBtn");


    /* =========================================
       STATE
    ========================================= */

    let recognition = null;

    let isListening = false;

    let finalTranscript = "";

    let currentLatitude = null;

    let currentLongitude = null;

    let lastEmergencyPhrase = "";

    let emergencyTriggered = false;

    let pendingCallNumber = "";


    /* =========================================
       SAFETY CHECK
    ========================================= */

    safeBtn?.addEventListener("click", () => {

        showStatus(
            "You're marked as safe. You can continue using MindMirror's wellness tools.",
            "success"
        );

    });


    helpBtn?.addEventListener("click", () => {

        showStatus(
            "Emergency support options are available below. If you are in immediate danger, contact local emergency services or a trusted person.",
            "error"
        );

        document
            .querySelector(".immediate-action")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

    });


    function showStatus(message, type) {

        if (!safetyMessage) {
            return;
        }

        safetyMessage.textContent = message;

        safetyMessage.className =
            `status-message show ${type}`;

    }


    /* =========================================
       SPEECH RECOGNITION
    ========================================= */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (SpeechRecognition) {

        recognition = new SpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.lang = "en-IN";


        recognition.onstart = () => {

            isListening = true;

            updateVoiceUI(true);

        };


        recognition.onend = () => {

            isListening = false;

            updateVoiceUI(false);

        };


        recognition.onerror = (event) => {

            isListening = false;

            updateVoiceUI(false);

            if (event.error !== "aborted") {

                showVoiceMessage(
                    "Voice recognition could not continue. Please try again."
                );

            }

        };


        recognition.onresult = (event) => {

            let interimTranscript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                const transcript =
                    event.results[i][0].transcript;

                if (event.results[i].isFinal) {

                    finalTranscript +=
                        transcript + " ";

                } else {

                    interimTranscript += transcript;

                }

            }


            const displayText =
                finalTranscript + interimTranscript;


            if (displayText.trim()) {

                transcriptText.textContent =
                    displayText.trim();

            }


            checkEmergencyPhrase(displayText);

        };

    } else {

        startVoiceBtn.disabled = true;

        startVoiceBtn.textContent =
            "Voice Not Supported";

        voiceStatusText.textContent =
            "This browser does not support speech recognition.";

    }


    /* =========================================
       START VOICE
    ========================================= */

    startVoiceBtn?.addEventListener("click", () => {

        if (!recognition) {

            showVoiceMessage(
                "Speech recognition is not supported in this browser."
            );

            return;
        }


        if (isListening) {
            return;
        }


        finalTranscript = "";

        emergencyTriggered = false;

        lastEmergencyPhrase = "";


        if (transcriptText) {

            transcriptText.textContent =
                "Listening...";

        }


        emergencyAlert?.classList.remove("show");


        try {

            recognition.start();

        } catch (error) {

            console.warn(
                "Voice recognition start:",
                error
            );

        }

    });


    /* =========================================
       STOP VOICE
    ========================================= */

    stopVoiceBtn?.addEventListener("click", () => {

        if (!recognition) {
            return;
        }


        try {

            recognition.stop();

        } catch (error) {

            console.warn(
                "Voice recognition stop:",
                error
            );

        }


        isListening = false;

        updateVoiceUI(false);

    });


    function updateVoiceUI(active) {

        if (!voiceStatus) {
            return;
        }


        if (active) {

            voiceStatus.classList.add("active");

            voiceStatusText.textContent =
                "Voice support is listening...";

            startVoiceBtn.disabled = true;

            stopVoiceBtn.disabled = false;

        } else {

            voiceStatus.classList.remove("active");

            voiceStatusText.textContent =
                "Voice support is not active";

            startVoiceBtn.disabled = false;

            stopVoiceBtn.disabled = true;

        }

    }


    function showVoiceMessage(message) {

        if (transcriptText) {

            transcriptText.textContent = message;

        }

    }


    /* =========================================
       EMERGENCY PHRASES
    ========================================= */

    const emergencyPatterns = [

        /\bemergency\b/i,

        /\bhelp me\b/i,

        /\bi need help\b/i,

        /\bi am in danger\b/i,

        /\bi'm in danger\b/i,

        /\bi don't feel safe\b/i,

        /\bi do not feel safe\b/i,

        /\bi feel unsafe\b/i,

        /\bunsafe right now\b/i,

        /\bsuicide\b/i,

        /\bsuicidal\b/i,

        /\bkill myself\b/i,

        /\bhurt myself\b/i,

        /\bharm myself\b/i,

        /\bself[- ]harm\b/i,

        /\bend my life\b/i,

        /\bi can't keep myself safe\b/i,

        /\bi cannot keep myself safe\b/i,

        /\bcall for help\b/i

    ];


    function checkEmergencyPhrase(text) {

        if (!text || emergencyTriggered) {
            return;
        }


        for (const pattern of emergencyPatterns) {

            const match = text.match(pattern);


            if (match) {

                lastEmergencyPhrase =
                    match[0];

                triggerEmergency(match[0]);

                break;

            }

        }

    }


    /* =========================================
       EMERGENCY DETECTED
    ========================================= */

    function triggerEmergency(phrase) {

        if (emergencyTriggered) {
            return;
        }


        emergencyTriggered = true;

        lastEmergencyPhrase = phrase;


        if (emergencyAlertText) {

            emergencyAlertText.textContent =
                `"${phrase}" was detected. Please confirm whether you want to share your location for emergency support.`;

        }


        emergencyAlert?.classList.add("show");


        setTimeout(() => {

            openModal(locationConsentModal);

        }, 500);

    }


    /* =========================================
       LOCATION BUTTON
    ========================================= */

    requestLocationBtn?.addEventListener("click", () => {

        openModal(locationConsentModal);

    });


    /* =========================================
       FIRST LOCATION CONFIRMATION
    ========================================= */

    cancelLocationBtn?.addEventListener("click", () => {

        closeModal(locationConsentModal);

    });


    continueLocationBtn?.addEventListener("click", () => {

        closeModal(locationConsentModal);

        openModal(locationConfirmModal);

    });


    /* =========================================
       SECOND LOCATION CONFIRMATION
    ========================================= */

    cancelLocationConfirmBtn?.addEventListener(
        "click",
        () => {

            closeModal(locationConfirmModal);

        }
    );


    confirmLocationBtn?.addEventListener(
        "click",
        () => {

            closeModal(locationConfirmModal);

            requestUnityLocation();

        }
    );


    /* =========================================
       UNITY LOCATION REQUEST
    ========================================= */

    function requestUnityLocation() {

        setLocationStatus(
            "Requesting emergency location...",
            ""
        );


        const requestData = {

            reason: "emergency",

            emergencyPhrase:
                lastEmergencyPhrase,

            transcript:
                finalTranscript,

            timestamp:
                new Date().toISOString()

        };


        /*
         * Frontend event.
         * Unity can listen for this event.
         */

        window.dispatchEvent(
            new CustomEvent(
                "mindmirror:request-location",
                {
                    detail: requestData
                }
            )
        );


        /*
         * Optional Unity bridge.
         */

        if (
            window.Unity &&
            typeof window.Unity.requestLocation ===
            "function"
        ) {

            window.Unity.requestLocation();

            return;

        }


        /*
         * No fake coordinates.
         */

        setLocationStatus(
            "Waiting for Unity/Android location integration.",
            ""
        );

    }


    /* =========================================
       BROWSER LOCATION TEST
    ========================================= */

    browserLocationBtn?.addEventListener(
        "click",
        () => {

            if (!navigator.geolocation) {

                setLocationStatus(
                    "Geolocation is not supported by this browser.",
                    "error"
                );

                return;

            }


            setLocationStatus(
                "Requesting browser location...",
                ""
            );


            navigator.geolocation.getCurrentPosition(

                (position) => {

                    handleLocationReceived(

                        position.coords.latitude,

                        position.coords.longitude,

                        {
                            source: "browser-test"
                        }

                    );

                },

                (error) => {

                    let message =
                        "Unable to get your location.";


                    if (
                        error.code ===
                        error.PERMISSION_DENIED
                    ) {

                        message =
                            "Location permission was denied.";

                    } else if (
                        error.code ===
                        error.POSITION_UNAVAILABLE
                    ) {

                        message =
                            "Location information is unavailable.";

                    } else if (
                        error.code ===
                        error.TIMEOUT
                    ) {

                        message =
                            "Location request timed out.";

                    }


                    setLocationStatus(
                        message,
                        "error"
                    );

                },

                {
                    enableHighAccuracy: true,

                    timeout: 10000,

                    maximumAge: 0

                }

            );

        }
    );


    /* =========================================
       RECEIVE LOCATION
    ========================================= */

    function handleLocationReceived(
        latitude,
        longitude,
        metadata = {}
    ) {

        const lat = Number(latitude);

        const lng = Number(longitude);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {

            setLocationStatus(
                "Invalid location coordinates received.",
                "error"
            );

            return;

        }


        if (
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {

            setLocationStatus(
                "The received coordinates are outside the valid range.",
                "error"
            );

            return;

        }


        currentLatitude = lat;

        currentLongitude = lng;


        latitudeValue.textContent =
            lat.toFixed(6);

        longitudeValue.textContent =
            lng.toFixed(6);


        setLocationStatus(
            "Location received successfully.",
            "success"
        );


        mapBtn.disabled = false;


        /*
         * Application event.
         * Backend/Unity integration can use this later.
         */

        window.dispatchEvent(
            new CustomEvent(
                "mindmirror:emergency-location-ready",
                {
                    detail: {

                        event:
                            "emergency_detected",

                        emergencyPhrase:
                            lastEmergencyPhrase,

                        transcript:
                            finalTranscript,

                        latitude: lat,

                        longitude: lng,

                        locationConfirmed: true,

                        timestamp:
                            new Date().toISOString(),

                        metadata:
                            metadata

                    }
                }
            )
        );

    }


    /* =========================================
       LOCATION STATUS
    ========================================= */

    function setLocationStatus(
        message,
        type
    ) {

        if (!locationStatusText) {
            return;
        }


        locationStatusText.textContent =
            message;


        locationStatus.className =
            "location-status";


        if (type) {

            locationStatus.classList.add(type);

        }

    }


    /* =========================================
       MAP
    ========================================= */

    mapBtn?.addEventListener("click", () => {

        if (
            currentLatitude === null ||
            currentLongitude === null
        ) {

            return;

        }


        const mapUrl =
            `https://www.google.com/maps?q=${currentLatitude},${currentLongitude}`;


        window.open(
            mapUrl,
            "_blank",
            "noopener,noreferrer"
        );

    });


    /* =========================================
       EMERGENCY CONTACT
    ========================================= */

    contactCallBtn?.addEventListener("click", () => {

        /*
         * Frontend demo:
         * Replace this value with the emergency
         * contact supplied by your backend/auth system.
         */

        const emergencyContact =
            localStorage.getItem(
                "mindmirrorEmergencyContact"
            );


        if (!emergencyContact) {

            showStatus(
                "No emergency contact has been configured yet.",
                "error"
            );

            return;

        }


        openCallConfirmation(
            emergencyContact,
            "Emergency Contact",
            "Do you want to call your configured emergency contact?"
        );

    });


    /* =========================================
       CALL 112
    ========================================= */

    emergencyServicesBtn?.addEventListener(
        "click",
        () => {

            openCallConfirmation(
                "112",
                "Emergency Services",
                "Do you want to call emergency services at 112?"
            );

        }
    );


    /* =========================================
       CALL CONFIRMATION
    ========================================= */

    function openCallConfirmation(
        phone,
        title,
        message
    ) {

        pendingCallNumber = phone;

        callModalTitle.textContent =
            `Call ${title}?`;

        callModalText.textContent =
            message;

        openModal(callModal);

    }


    cancelCallBtn?.addEventListener(
        "click",
        () => {

            closeModal(callModal);

            pendingCallNumber = "";

        }
    );


    confirmCallBtn?.addEventListener(
        "click",
        () => {

            if (!pendingCallNumber) {
                return;
            }


            const number =
                pendingCallNumber;


            closeModal(callModal);

            pendingCallNumber = "";


            window.location.href =
                `tel:${number}`;

        }
    );


    /* =========================================
       MODAL HELPERS
    ========================================= */

    function openModal(modal) {

        if (!modal) {
            return;
        }


        modal.classList.add("show");

        document.body.style.overflow =
            "hidden";

    }


    function closeModal(modal) {

        if (!modal) {
            return;
        }


        modal.classList.remove("show");


        if (
            !document.querySelector(
                ".modal-overlay.show"
            )
        ) {

            document.body.style.overflow = "";

        }

    }


    /* =========================================
       CLICK OUTSIDE MODAL
    ========================================= */

    document
        .querySelectorAll(".modal-overlay")
        .forEach((overlay) => {

            overlay.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target === overlay
                    ) {

                        closeModal(overlay);

                    }

                }
            );

        });


    /* =========================================
       ESCAPE
    ========================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            document
                .querySelectorAll(
                    ".modal-overlay.show"
                )
                .forEach((modal) => {

                    closeModal(modal);

                });

        }
    );


    /* =========================================
       MINDMIRROR FRONTEND API
       UNITY CAN USE THIS
    ========================================= */

    window.MindMirrorEmergencyAPI = {

        receiveLocationFromUnity(
            latitude,
            longitude,
            metadata = {}
        ) {

            handleLocationReceived(
                latitude,
                longitude,
                metadata
            );

        },


        emergencyDetected(text) {

            lastEmergencyPhrase =
                text || "Emergency detected";

            triggerEmergency(
                lastEmergencyPhrase
            );

        },


        getEmergencyPayload() {

            return {

                event:
                    "emergency_detected",

                emergencyPhrase:
                    lastEmergencyPhrase,

                transcript:
                    finalTranscript,

                latitude:
                    currentLatitude,

                longitude:
                    currentLongitude,

                locationConfirmed:
                    currentLatitude !== null &&
                    currentLongitude !== null,

                timestamp:
                    new Date().toISOString()

            };

        }

    };


    /* =========================================
       UNITY LOCATION EVENT
    ========================================= */

    window.addEventListener(
        "mindmirror:location-received",
        (event) => {

            const data =
                event.detail || {};


            handleLocationReceived(

                data.latitude,

                data.longitude,

                data.metadata || {}

            );

        }
    );

});