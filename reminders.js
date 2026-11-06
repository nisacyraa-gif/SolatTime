// ==========================================
// REMINDER MANAGER CLASS 
// ==========================================
class ReminderManager {
    constructor() {
        this.storageKey = "solattime_reminders";
    }

    getReminders() {
        let data = localStorage.getItem(this.storageKey);
        if (data === null) {
            return [];
        } else {
            return JSON.parse(data);
        }
    }

    saveReminders(arr) {
        let str = JSON.stringify(arr);
        localStorage.setItem(this.storageKey, str);
    }

    addReminder(item) {
        let list = this.getReminders();
        list.push(item);
        this.saveReminders(list);
    }

    updateReminder(index, item) {
        let list = this.getReminders();
        list[index] = item;
        this.saveReminders(list);
    }

    deleteReminder(index) {
        let list = this.getReminders();
        list.splice(index, 1);
        this.saveReminders(list);
    }
}

// ==========================================
// OBJECT CREATION & DOM ELEMENTS
// ==========================================
let manager = new ReminderManager();

let backToMainBtn = document.getElementById("backToMainBtn");
let titleInput = document.getElementById("reminderTitle");
let timeInput = document.getElementById("reminderTime");
let dayCheckboxes = document.querySelectorAll('input[name="reminderDay"]');
let saveBtn = document.getElementById("saveBtn");
let editIndexInput = document.getElementById("editIndex");
let formTitle = document.getElementById("formTitle");
let reminderListContainer = document.getElementById("reminderListContainer");
let badgeCount = document.getElementById("badgeCount");

// ==========================================
// PRESET HELPER FUNCTION
// ==========================================
function addPreset(title, time, days) {
    let newItem = {
        title: title,
        time: time,
        days: days
    };
    manager.addReminder(newItem);
    render();
}

// ==========================================
// RENDER FUNCTION (DISPLAY DATA)
// ==========================================
function render() {
    let reminders = manager.getReminders();
    let currentEditingIndex = parseInt(editIndexInput.value);
    
    badgeCount.textContent = reminders.length + " reminders";
    reminderListContainer.innerHTML = "";

    if (reminders.length === 0) {
        reminderListContainer.innerHTML = 
            "<div class='empty-reminders'>No reminders saved yet. Click a preset above or create one manually!</div>";
        return;
    }

    for (let i = 0; i < reminders.length; i++) {
        let rem = reminders[i];
        let isEditingThis = (i === currentEditingIndex);
        
        let daysString = "";
        if (rem.days && rem.days.length > 0) {
            daysString = rem.days.join(", ");
        } 
        else {
            daysString = "No days selected";
        }

        let div = document.createElement("div");
        if (isEditingThis === true) {
            div.className = "reminder-list-item is-editing";
        } 
        else {
            div.className = "reminder-list-item";
        }

        let editLabel = "";
        if (isEditingThis === true) {
            editLabel = " <span style='color:#d97706; font-size:12px; font-weight:bold;'>(Editing...)</span>";
        }

        div.innerHTML = 
            "<div class='reminder-time-tag'>🕒 " + rem.time + "</div>" +
            "<div class='reminder-details' style='flex:1;'>" +
                "<h4>" + rem.title + editLabel + "</h4>" +
                "<span>🔁 " + daysString + "</span>" +
            "</div>" +
            "<div>" +
                "<button onclick='editItem(" + i + ")' title='Edit Reminder'>✏️</button>" +
                "<button onclick='deleteItem(" + i + ")' title='Delete Reminder'>🗑️</button>" +
            "</div>";

        reminderListContainer.appendChild(div);
    }
}

// ==========================================
// SAVE & UPDATE BUTTON EVENT HANDLER
// ==========================================
saveBtn.onclick = function() {
    let title = titleInput.value.trim();
    let time = timeInput.value;
    let editIndex = parseInt(editIndexInput.value);

    let selectedDays = [];
    for (let i = 0; i < dayCheckboxes.length; i++) {
        if (dayCheckboxes[i].checked === true) {
            selectedDays.push(dayCheckboxes[i].value);
        }
    }

    if (title === "" || time === "") {
        alert("Please enter both activity name and time.");
    } 
    else if (selectedDays.length === 0) {
        alert("Please select at least one day for the reminder.");
    } 
    else {
        let reminderData = {
            title: title,
            time: time,
            days: selectedDays
        };

        if (editIndex === -1) {
            manager.addReminder(reminderData);
        } else {
            manager.updateReminder(editIndex, reminderData);
            resetFormToCreateMode();
        }

        titleInput.value = "";
        timeInput.value = "";
        for (let j = 0; j < dayCheckboxes.length; j++) {
            dayCheckboxes[j].checked = false;
        }

        render();
    }
};

// ==========================================
// EDIT & DELETE FUNCTIONS
// ==========================================
function editItem(i) {
    let reminders = manager.getReminders();
    let rem = reminders[i];

    titleInput.value = rem.title;
    timeInput.value = rem.time;
    
    for (let j = 0; j < dayCheckboxes.length; j++) {
        let cb = dayCheckboxes[j];
        cb.checked = false;
        if (rem.days) {
            for (let k = 0; k < rem.days.length; k++) {
                if (rem.days[k] === cb.value) {
                    cb.checked = true;
                }
            }
        }
    }

    editIndexInput.value = i;
    if (formTitle) formTitle.textContent = "Edit Reminder";
    saveBtn.textContent = "Update Reminder";
    
    render();
}

function cancelEdit() {
    resetFormToCreateMode();
    titleInput.value = "";
    timeInput.value = "";
    for (let j = 0; j < dayCheckboxes.length; j++) {
        dayCheckboxes[j].checked = false;
    }
    render();
}

function resetFormToCreateMode() {
    editIndexInput.value = "-1";
    if (formTitle) formTitle.textContent = "Create Reminder";
    saveBtn.textContent = "Save Reminder";
}

function deleteItem(i) {
    let confirmation = confirm("Delete this reminder?");
    if (confirmation === true) {
        if (parseInt(editIndexInput.value) === i) {
            cancelEdit();
        }
        manager.deleteReminder(i);
        render();
    }
}

// Initial Render Call
render();