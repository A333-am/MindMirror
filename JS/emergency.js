/* =========================================================
   MINDMIRROR
   EMERGENCY SUPPORT JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const safeBtn =
        document.getElementById("safeBtn");

    const helpBtn =
        document.getElementById("helpBtn");

    const safetyMessage =
        document.getElementById("safetyMessage");


    const startVoiceBtn =
        document.getElementById("startVoiceBtn");

    const stopVoiceBtn =
        document.getElementById("stopVoiceBtn");


    const voiceStatus =
        document.getElementById("voiceStatus");

    const voiceStatusDot =
        document.getElementById("voiceStatusDot");

    const voiceStatusText =
        document.getElementById("voiceStatusText");


    const transcriptText =
        document.getElementById("transcriptText");


    const emergencyAlert =
        document.getElementById("emergencyAlert");

    const emergencyAlertText =
        document.getElementById("emergencyAlertText");


    const emergencyStatusCard =
        document.getElementById("emergencyStatusCard");

    const emergencyStatusTitle =
        document.getElementById("emergencyStatusTitle");

    const emergencyStatusText =
        document.getElementById("emergencyStatusText");


    const adultBtn =
        document.getElementById("adultBtn");

    const childBtn =
        document.getElementById("childBtn");

    const childHelpCard =
        document.getElementById("childHelpCard");


    const requestLocationBtn =
        document.getElementById("requestLocationBtn");

    const mapBtn =
        document.getElementById("mapBtn");


    const locationStatus =
        document.getElementById("locationStatus");

    const locationStatusText =
        document.getElementById("locationStatusText");


    const latitudeValue =
        document.getElementById("latitudeValue");

    const longitudeValue =
        document.getElementById("longitudeValue");


    const contactName =
        document.getElementById("contactName");

    const contactPhone =
        document.getElementById("contactPhone");

    const contactRelation =
        document.getElementById("contactRelation");


    const saveContactBtn =
        document.getElementById("saveContactBtn");


    const savedContact =
        document.getElementById("savedContact");

    const savedContactName =
        document.getElementById("savedContactName");

    const savedContactDetails =
        document.getElementById("savedContactDetails");


    const contactCallBtn =
        document.getElementById("contactCallBtn");

    const emergencyServicesBtn =
        document.getElementById("emergencyServicesBtn");

    const contactCallDescription =
        document.getElementById("contactCallDescription");


    /* =====================================================
       STATE
    ===================================================== */

    let recognition = null;

    let voiceActive = false;

    let emergencyTriggered = false;

    let emergencyInProgress = false;

    let selectedAge = null;

    let currentLatitude = null;

    let currentLongitude = null;

    let lastEmergencyPhrase = "";

    let finalTranscript = "";

    let emergencyContact = null;


    /* =====================================================
       EMERGENCY PHRASES
    ===================================================== */

    const emergencyPatterns = [

        "emergency",

        "help me",

        "i need help",

        "i am in danger",

        "i'm in danger",

        "i dont feel safe",

        "i don't feel safe",

        "i do not feel safe",

        "i feel unsafe",

        "unsafe right now",

        "suicide",

        "suicidal",

        "kill myself",

        "hurt myself",

        "harm myself",

        "self harm",

        "self-harm",

        "end my life",

        "i cannot keep myself safe",

        "i can't keep myself safe",

        "call for help",

        "please help me"

    ];


    /* =====================================================
       NORMALIZE TEXT
    ===================================================== */

    function normalizeText(text) {

        return String(text || "")

            .toLowerCase()

            .replace(/[’']/g, "'")

            .replace(/[^\w\s'-]/g, " ")

            .replace(/\s+/g, " ")

            .trim();

    }


    /* =====================================================
       DETECT EMERGENCY
    ===================================================== */

    function detectEmergency(text) {

        const normalized =
            normalizeText(text);


        return emergencyPatterns.some(
            phrase =>
                normalized.includes(
                    normalizeText(phrase)
                )
        );

    }


    /* =====================================================
       UPDATE VOICE STATUS
    ===================================================== */

    function setVoiceStatus(
        message,
        type = ""
    ) {

        voiceStatusText.textContent =
            message;

        voiceStatus.className =
            "voice-status";

        if (type) {

            voiceStatus.classList.add(type);

        }

    }


    /* =====================================================
       UPDATE LOCATION STATUS
    ===================================================== */

    function setLocationStatus(
        message,
        type = ""
    ) {

        locationStatusText.textContent =
            message;

        locationStatus.className =
            "location-status";

        if (type) {

            locationStatus.classList.add(type);

        }

    }


    /* =====================================================
       UPDATE EMERGENCY STATUS
    ===================================================== */

    function setEmergencyStatus(
        title,
        message,
        active = false
    ) {

        emergencyStatusTitle.textContent =
            title;

        emergencyStatusText.textContent =
            message;

        emergencyStatusCard.classList.toggle(
            "active",
            active
        );

    }


    /* =====================================================
       LOAD CONTACT
    ===================================================== */

    function loadEmergencyContact() {

        try {

            const stored =
                localStorage.getItem(
                    "mindmirrorEmergencyContact"
                );

            if (!stored) {

                return null;

            }


            /*
             * Supports the old format:
             * "9876543210"
             */

            if (
                typeof stored === "string" &&
                !stored.trim().startsWith("{")
            ) {

                return {

                    name: "Emergency Contact",

                    phone: stored,

                    relation: "Trusted Contact"

                };

            }


            const parsed =
                JSON.parse(stored);


            if (
                parsed &&
                parsed.phone
            ) {

                return parsed;

            }

        } catch (error) {

            console.error(
                "Could not load emergency contact:",
                error
            );

        }


        return null;

    }


    /* =====================================================
       DISPLAY CONTACT
    ===================================================== */

    function displayEmergencyContact() {

        emergencyContact =
            loadEmergencyContact();


        if (!emergencyContact) {

            savedContact.classList.remove(
                "show"
            );

            savedContactName.textContent =
                "No contact saved";

            savedContactDetails.textContent =
                "";

            contactCallDescription.textContent =
                "No emergency contact configured.";

            return;

        }


        savedContact.classList.add(
            "show"
        );


        savedContactName.textContent =
            emergencyContact.name ||
            "Emergency Contact";


        savedContactDetails.textContent =
            `${emergencyContact.phone}${
                emergencyContact.relation
                    ? " • " + emergencyContact.relation
                    : ""
            }`;


        contactCallDescription.textContent =
            `Configured contact: ${
                emergencyContact.name ||
                "Emergency Contact"
            }`;
    }


    /* =====================================================
       SAVE CONTACT
    ===================================================== */

    saveContactBtn?.addEventListener(
        "click",
        () => {

            const name =
                contactName.value.trim();

            const phone =
                contactPhone.value.trim();

            const relation =
                contactRelation.value.trim();


            if (!name) {

                alert(
                    "Please enter the emergency contact name."
                );

                contactName.focus();

                return;

            }


            if (!phone) {

                alert(
                    "Please enter the emergency contact phone number."
                );

                contactPhone.focus();

                return;

            }


            const cleanedPhone =
                phone.replace(/[^\d+]/g, "");


            if (
                cleanedPhone.length < 8
            ) {

                alert(
                    "Please enter a valid phone number."
                );

                contactPhone.focus();

                return;

            }


            const data = {

                name,

                phone: cleanedPhone,

                relation

            };


            localStorage.setItem(

                "mindmirrorEmergencyContact",

                JSON.stringify(data)

            );


            emergencyContact =
                data;


            displayEmergencyContact();


            alert(
                "Emergency contact saved successfully."
            );

        }
    );


    /* =====================================================
       AGE SELECTION
    ===================================================== */

    adultBtn?.addEventListener(
        "click",
        () => {

            selectedAge = "adult";

            adultBtn.classList.add(
                "selected"
            );

            childBtn.classList.remove(
                "selected"
            );

            childHelpCard.classList.remove(
                "show"
            );

        }
    );


    childBtn?.addEventListener(
        "click",
        () => {

            selectedAge = "child";

            childBtn.classList.add(
                "selected"
            );

            adultBtn.classList.remove(
                "selected"
            );

            childHelpCard.classList.add(
                "show"
            );

        }
    );


    /* =====================================================
       SAFETY BUTTON
    ===================================================== */

    safeBtn?.addEventListener(
        "click",
        () => {

            emergencyTriggered = false;

            emergencyInProgress = false;

            emergencyAlert.classList.remove(
                "show"
            );


            setEmergencyStatus(

                "No emergency detected",

                "You marked yourself as safe.",

                false

            );


            safetyMessage.textContent =
                "I'm glad you are safe. You can continue using MindMirror normally.";

        }
    );


    /* =====================================================
       MANUAL HELP
    ===================================================== */

    helpBtn?.addEventListener(
        "click",
        () => {

            triggerEmergency(
                "User requested emergency help"
            );

        }
    );


    /* =====================================================
       START VOICE
    ===================================================== */

    startVoiceBtn?.addEventListener(
        "click",
        startVoiceSupport
    );


    /* =====================================================
       STOP VOICE
    ===================================================== */

    stopVoiceBtn?.addEventListener(
        "click",
        stopVoiceSupport
    );


    /* =====================================================
       CREATE SPEECH RECOGNITION
    ===================================================== */

    function createRecognition() {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            setVoiceStatus(

                "Voice recognition is not supported in this browser.",

                "error"

            );

            return null;

        }


        const instance =
            new SpeechRecognition();


        instance.continuous = true;

        instance.interimResults = true;

        instance.lang = "en-IN";

        instance.maxAlternatives = 1;


        /* ================================================
           RESULT
        ================================================= */

        instance.onresult =
            (event) => {

                let interim = "";

                let newFinalText = "";


                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const result =
                        event.results[i];


                    const transcript =
                        result[0].transcript;


                    if (result.isFinal) {

                        newFinalText +=
                            transcript + " ";

                    } else {

                        interim +=
                            transcript;

                    }

                }


                if (newFinalText) {

                    finalTranscript +=
                        newFinalText;

                }


                const displayTranscript =
                    (
                        finalTranscript +
                        " " +
                        interim
                    ).trim();


                transcriptText.textContent =
                    displayTranscript ||
                    "Listening...";


                /*
                 * CHECK BOTH FINAL AND INTERIM SPEECH.
                 *
                 * This is important because emergency
                 * words should not have to wait for a
                 * long sentence to finish.
                 */

                const textToCheck =
                    (
                        finalTranscript +
                        " " +
                        interim
                    ).trim();


                if (
                    detectEmergency(
                        textToCheck
                    )
                ) {

                    const match =
                        emergencyPatterns.find(
                            phrase =>
                                normalizeText(
                                    textToCheck
                                ).includes(
                                    normalizeText(
                                        phrase
                                    )
                                )
                        );


                    triggerEmergency(
                        match ||
                        "Emergency phrase detected"
                    );

                }

            };


        /* =================================================
           ERROR
        ================================================= */

        instance.onerror =
            (event) => {

                console.error(
                    "Speech recognition error:",
                    event.error
                );


                if (
                    event.error ===
                    "not-allowed"
                ) {

                    setVoiceStatus(

                        "Microphone permission was denied.",

                        "error"

                    );

                    return;

                }


                if (
                    event.error ===
                    "no-speech"
                ) {

                    return;

                }


                setVoiceStatus(

                    `Voice recognition error: ${event.error}`,

                    "error"

                );

            };


        /* =================================================
           END
        ================================================= */

        instance.onend =
            () => {

                /*
                 * Chrome sometimes stops recognition
                 * automatically.
                 *
                 * Restart while the user still has
                 * voice support active.
                 */

                if (
                    voiceActive &&
                    !emergencyInProgress
                ) {

                    try {

                        instance.start();

                    } catch (error) {

                        console.log(
                            "Recognition restart skipped."
                        );

                    }

                }

            };


        return instance;

    }


    /* =====================================================
       START VOICE SUPPORT
    ===================================================== */

    function startVoiceSupport() {

        if (voiceActive) {

            return;

        }


        recognition =
            createRecognition();


        if (!recognition) {

            return;

        }


        finalTranscript = "";

        transcriptText.textContent =
            "Listening...";


        voiceActive = true;


        startVoiceBtn.disabled =
            true;

        stopVoiceBtn.disabled =
            false;


        voiceStatus.classList.add(
            "active"
        );


        voiceStatusText.textContent =
            "Listening for emergency speech...";


        try {

            recognition.start();

        } catch (error) {

            console.error(
                "Could not start speech recognition:",
                error
            );


            voiceActive = false;

            startVoiceBtn.disabled =
                false;

            stopVoiceBtn.disabled =
                true;


            setVoiceStatus(
                "Could not start voice support.",
                "error"
            );

        }

    }


    /* =====================================================
       STOP VOICE SUPPORT
    ===================================================== */

    function stopVoiceSupport() {

        voiceActive = false;


        if (recognition) {

            try {

                recognition.onend = null;

                recognition.stop();

            } catch (error) {

                console.log(
                    "Recognition already stopped."
                );

            }

        }


        recognition = null;


        startVoiceBtn.disabled =
            false;

        stopVoiceBtn.disabled =
            true;


        setVoiceStatus(
            "Voice support is not active"
        );

    }


    /* =====================================================
       TRIGGER EMERGENCY
    ===================================================== */

    function triggerEmergency(
        emergencyPhrase
    ) {

        /*
         * Prevent repeated triggers.
         */

        if (
            emergencyTriggered ||
            emergencyInProgress
        ) {

            return;

        }


        emergencyTriggered = true;

        emergencyInProgress = true;

        lastEmergencyPhrase =
            emergencyPhrase;


        /* ================================================
           STOP VOICE RECOGNITION
        ================================================= */

        voiceActive = false;


        if (recognition) {

            try {

                recognition.onend = null;

                recognition.stop();

            } catch (error) {

                console.log(
                    "Recognition stopped."
                );

            }

        }


        recognition = null;


        startVoiceBtn.disabled =
            false;

        stopVoiceBtn.disabled =
            true;


        /* ================================================
           SHOW EMERGENCY UI
        ================================================= */

        emergencyAlert.classList.add(
            "show"
        );


        emergencyAlertText.textContent =
            `Detected: "${emergencyPhrase}". Emergency support is being activated.`;


        setEmergencyStatus(

            "Emergency detected",

            "MindMirror has detected emergency speech and started the emergency workflow.",

            true

        );


        setVoiceStatus(
            "Emergency detected",
            "error"
        );


        safetyMessage.textContent =
            "Emergency support has been activated.";


        /* ================================================
           AUTOMATIC EMERGENCY ACTION
        ================================================= */

        startAutomaticEmergencyWorkflow();

    }


    /* =====================================================
       AUTOMATIC EMERGENCY WORKFLOW
    ===================================================== */

    async function startAutomaticEmergencyWorkflow() {

        setEmergencyStatus(

            "Emergency support active",

            "Getting location and preparing emergency contact support.",

            true

        );


        /*
         * 1. Try to obtain location automatically.
         *
         * Browser permission may still be required.
         */

        await requestEmergencyLocation();


        /*
         * 2. Send emergency data to backend if an
         * endpoint has been configured.
         */

        await sendEmergencyToBackend();


        /*
         * 3. Attempt emergency contact.
         */

        const contact =
            loadEmergencyContact();


        if (contact && contact.phone) {

            setEmergencyStatus(

                "Calling emergency contact",

                `Attempting to contact ${contact.name || "your emergency contact"}.`,

                true

            );


            /*
             * The browser cannot verify whether the
             * person answered the call.
             *
             * It can launch the phone call interface.
             */

            callNumberAutomatically(
                contact.phone
            );


            /*
             * Give the user the 112 fallback immediately.
             */

            setTimeout(
                () => {

                    showEmergencyFallback();

                },
                7000
            );


            return;

        }


        /*
         * No emergency contact.
         *
         * Go directly to emergency-services fallback.
         */

        showEmergencyFallback();

    }


    /* =====================================================
       REQUEST LOCATION
    ===================================================== */

    function requestEmergencyLocation() {

        return new Promise(
            (resolve) => {

                setLocationStatus(
                    "Requesting emergency location..."
                );


                /*
                 * Unity / Android integration.
                 */

                window.dispatchEvent(

                    new CustomEvent(
                        "mindmirror:request-location",
                        {
                            detail: {

                                reason:
                                    "voice_emergency",

                                emergencyPhrase:
                                    lastEmergencyPhrase,

                                transcript:
                                    finalTranscript,

                                timestamp:
                                    new Date().toISOString()

                            }

                        }
                    )

                );


                /*
                 * If browser geolocation is available,
                 * use it as a frontend/mobile fallback.
                 */

                if (
                    !navigator.geolocation
                ) {

                    setLocationStatus(

                        "Waiting for Unity / Android location.",

                        ""

                    );

                    resolve();

                    return;

                }


                navigator.geolocation.getCurrentPosition(

                    position => {

                        handleLocationReceived(

                            position.coords.latitude,

                            position.coords.longitude,

                            {
                                source:
                                    "browser"
                            }

                        );


                        resolve();

                    },

                    error => {

                        console.warn(
                            "Browser location unavailable:",
                            error
                        );


                        setLocationStatus(

                            "Waiting for Unity / Android location.",

                            ""

                        );


                        resolve();

                    },

                    {
                        enableHighAccuracy: true,

                        timeout: 10000,

                        maximumAge: 0

                    }

                );

            }
        );

    }


    /* =====================================================
       RECEIVE UNITY LOCATION
    ===================================================== */

    function handleLocationReceived(
        latitude,
        longitude,
        metadata = {}
    ) {

        const lat =
            Number(latitude);

        const lng =
            Number(longitude);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng) ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {

            setLocationStatus(
                "Invalid location received.",
                "error"
            );

            return;

        }


        currentLatitude =
            lat;

        currentLongitude =
            lng;


        latitudeValue.textContent =
            lat.toFixed(6);

        longitudeValue.textContent =
            lng.toFixed(6);


        setLocationStatus(
            "Emergency location received successfully.",
            "success"
        );


        mapBtn.disabled =
            false;


        /*
         * Send location event for Unity/backend.
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

                        latitude:
                            lat,

                        longitude:
                            lng,

                        locationConfirmed:
                            true,

                        metadata,

                        timestamp:
                            new Date().toISOString()

                    }

                }
            )

        );

    }


    /* =====================================================
       UNITY API
    ===================================================== */

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


        emergencyDetected(
            text
        ) {

            triggerEmergency(
                text ||
                "Emergency detected"
            );

        }

    };


    /* =====================================================
       AUTOMATIC PHONE CALL
    ===================================================== */

    function callNumberAutomatically(
        phone
    ) {

        if (!phone) {

            return false;

        }


        const cleaned =
            String(phone)
                .replace(/[^\d+]/g, "");


        if (!cleaned) {

            return false;

        }


        /*
         * Mobile browsers / Android may open the
         * dialer rather than silently placing the call.
         */

        window.location.href =
            `tel:${cleaned}`;


        return true;

    }


    /* =====================================================
       FALLBACK 112
    ===================================================== */

    function showEmergencyFallback() {

        setEmergencyStatus(

            "Emergency contact fallback",

            "If your emergency contact did not respond or could not be reached, use emergency services.",

            true

        );


        emergencyAlert.classList.add(
            "show"
        );


        emergencyAlertText.innerHTML =
            `
                Emergency contact could not be confirmed.
                <br><br>
                <strong>Use 112 for immediate emergency assistance.</strong>
            `;


        /*
         * IMPORTANT:
         *
         * A browser cannot know whether the previous
         * phone call was answered.
         *
         * Therefore we do NOT pretend that the contact
         * failed or that 112 was successfully called.
         *
         * The 112 button remains available.
         */

        emergencyServicesBtn.focus();

    }


    /* =====================================================
       MANUAL CONTACT CALL
    ===================================================== */

    contactCallBtn?.addEventListener(
        "click",
        () => {

            const contact =
                loadEmergencyContact();


            if (
                !contact ||
                !contact.phone
            ) {

                alert(
                    "Please save an emergency contact first."
                );

                return;

            }


            callNumberAutomatically(
                contact.phone
            );

        }
    );


    /* =====================================================
       MANUAL 112
    ===================================================== */

    emergencyServicesBtn?.addEventListener(
        "click",
        () => {

            callNumberAutomatically(
                "112"
            );

        }
    );


    /* =====================================================
       REQUEST LOCATION BUTTON
    ===================================================== */

    requestLocationBtn?.addEventListener(
        "click",
        () => {

            requestEmergencyLocation();

        }
    );


    /* =====================================================
       MAP
    ===================================================== */

    mapBtn?.addEventListener(
        "click",
        () => {

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

        }
    );


    /* =====================================================
       BACKEND EMERGENCY REQUEST
    ===================================================== */

    async function sendEmergencyToBackend() {

        /*
         * IMPORTANT:
         *
         * Replace this endpoint with the REAL Flask
         * emergency endpoint when it is implemented.
         *
         * Do NOT claim that the frontend has sent an
         * emergency notification unless the backend
         * actually responds successfully.
         */

        const endpoint =
            window.MINDMIRROR_EMERGENCY_ENDPOINT;


        if (!endpoint) {

            console.warn(
                "Emergency backend endpoint is not configured."
            );

            return false;

        }


        const payload = {

            emergency: true,

            emergency_phrase:
                lastEmergencyPhrase,

            transcript:
                finalTranscript,

            age_group:
                selectedAge,

            latitude:
                currentLatitude,

            longitude:
                currentLongitude,

            emergency_contact:
                loadEmergencyContact(),

            timestamp:
                new Date().toISOString()

        };


        try {

            const response =
                await fetch(
                    endpoint,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        credentials: "include",

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Backend returned ${response.status}`
                );

            }


            console.log(
                "Emergency information sent to backend."
            );


            return true;

        } catch (error) {

            console.error(
                "Emergency backend request failed:",
                error
            );


            return false;

        }

    }


    /* =====================================================
       LISTEN FOR UNITY LOCATION
    ===================================================== */

    window.addEventListener(
        "mindmirror:location-received",
        event => {

            const detail =
                event.detail || {};


            handleLocationReceived(

                detail.latitude,

                detail.longitude,

                detail.metadata || {}

            );

        }
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    displayEmergencyContact();


    setEmergencyStatus(

        "No emergency detected",

        "Voice emergency monitoring is ready.",

        false

    );

});