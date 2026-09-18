// Journal functionality

const saveJournalButton = document.getElementById("saveJournal");

if (saveJournalButton) {

    const journalTitleInput = document.getElementById("journalTitle");
    const journalEntryInput = document.getElementById("journalEntry");
    const journalMessage = document.getElementById("journalMessage");

    if (journalTitleInput && journalEntryInput && journalMessage) {

        saveJournalButton.addEventListener("click", function () {

            const journalTitle = journalTitleInput.value.trim();
            const journalEntry = journalEntryInput.value.trim();

            journalMessage.classList.remove("show", "error");

            // Validate input
            if (journalTitle === "" || journalEntry === "") {

                journalMessage.textContent =
                    "⚠️ Please enter a title and your thoughts.";

                journalMessage.classList.add("error", "show");

                return;
            }

            // Create journal data
            const journalData = {
                title: journalTitle,
                entry: journalEntry,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            };

            // Save journal entry
            localStorage.setItem(
                "mindMirrorJournal",
                JSON.stringify(journalData)
            );

            // Show success message
            journalMessage.textContent =
                "✅ Journal entry saved successfully!";

            journalMessage.classList.add("show");

            // Clear fields after saving
            journalTitleInput.value = "";
            journalEntryInput.value = "";

            setTimeout(function () {
                journalMessage.classList.remove("show");
            }, 2500);

        });
    }
}