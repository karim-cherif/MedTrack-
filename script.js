function checkMedicationIntake() {
  var currentTime = new Date();

  var medications = JSON.parse(localStorage.getItem("medications")) || [];

  medications.forEach(function (medication) {
    var intakeTime = new Date();
    var [hours, minutes] = medication.intakeTime.split(":");
    intakeTime.setHours(hours);
    intakeTime.setMinutes(minutes);

    if (
      currentTime.getHours() === intakeTime.getHours() &&
      currentTime.getMinutes() === intakeTime.getMinutes()
    ) {
      showNotification(
        "Medication Reminder",
        `It's time to take your ${medication.name}.`
      );
    }
  });
}

document
  .getElementById("medication-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var medicationName = document
      .getElementById("medication-name")
      .value.trim();
    var dosage = document.getElementById("dosage").value.trim();
    var frequency = document.getElementById("frequency").value;
    var intakeTime = document.getElementById("intake-time").value;

    if (medicationName === "" || dosage === "" || intakeTime === "") {
      alert("Please fill in all fields.");
      return;
    }

    var medication = {
      name: medicationName,
      dosage: dosage,
      frequency: frequency,
      intakeTime: intakeTime,
    };

    addMedicationToLocalStorage(medication);

    addMedicationToSchedule(medication);

    document.getElementById("medication-name").value = "";
    document.getElementById("dosage").value = "";
    document.getElementById("intake-time").value = "";
  });

function showNotification(title, body) {
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
  } else if (Notification.permission === "granted") {
    new Notification(title, { body: body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification(title, { body: body });
      }
    });
  }
}

function addMedicationToLocalStorage(medication) {
  var existingMedications =
    JSON.parse(localStorage.getItem("medications")) || [];

  existingMedications.push(medication);

  localStorage.setItem("medications", JSON.stringify(existingMedications));
}

function loadMedicationsFromLocalStorage() {
  var medications = JSON.parse(localStorage.getItem("medications")) || [];

  medications.forEach(function (medication) {
    addMedicationToSchedule(medication);
  });
}

function addMedicationToSchedule(medication) {
  var medicationItem = document.createElement("div");
  medicationItem.classList.add("medication-item");
  medicationItem.innerHTML = `
        <strong>${medication.name}</strong> - Dosage: ${medication.dosage}, Frequency: ${medication.frequency}, Intake Time: ${medication.intakeTime}
    `;

  var medicationList = document.getElementById("medication-list");
  medicationList.appendChild(medicationItem);
}

window.addEventListener("load", function () {
  loadMedicationsFromLocalStorage();

  setInterval(checkMedicationIntake, 60000);
});
