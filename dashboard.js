// ===== LOAD USER =====
window.onload = function () {
let user = localStorage.getItem("loggedInUser");

if (!user) {
    alert("⚠️ Please login first!");
    window.location.href = "login.html";
} else {
    document.getElementById("welcome").innerText = "👋 Welcome, " + user;
    loadTasks();
}

};

// ===== DARK MODE =====
function toggleDarkMode() {
document.body.classList.toggle("dark");
}

// ===== PROFILE (Still localStorage - optional DB later) =====
function saveProfile() {
let name = document.getElementById("fullname").value;
let email = document.getElementById("email").value;
let city = document.getElementById("city").value;

let profile = { name, email, city };
localStorage.setItem("profile", JSON.stringify(profile));

displayProfile(profile);
return false;

}

function displayProfile(profile) {
document.getElementById("profileDisplay").innerHTML =
"<p><b>Name:</b> ${profile.name}</p> <p><b>Email:</b> ${profile.email}</p> <p><b>City:</b> ${profile.city}</p>";
}

// ===== ADD TASK (CREATE) =====
function addTask() {
let task = document.getElementById("taskInput").value;
let user = localStorage.getItem("loggedInUser");

if (!task) return;

fetch("http://localhost:3000/add-task", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: user, task: task })
})
.then(res => res.text())
.then(data => {
    alert("✅ Task Added!");
    document.getElementById("taskInput").value = "";
    loadTasks();
});

}

// ===== LOAD TASKS (READ) =====
function loadTasks() {
let user = localStorage.getItem("loggedInUser");

fetch(`http://localhost:3000/tasks/${user}`)
.then(res => res.json())
.then(data => {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    data.forEach(t => {
        list.innerHTML += `
            <li>
                ${t.task}
                <button onclick="deleteTask(${t.id})">❌</button>
            </li>
        `;
    });
});

}

// ===== DELETE TASK =====
function deleteTask(id) {
fetch("http://localhost:3000/delete-task/${id}", {
method: "DELETE"
})
.then(res => res.text())
.then(data => {
alert("❌ Task Deleted!");
loadTasks();
});
}

// ===== EXPENSE (Still localStorage) =====
function addExpense() {
let name = document.getElementById("expenseName").value;
let amount = document.getElementById("expenseAmount").value;

if (!name || !amount) return;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
expenses.push({ name, amount: Number(amount) });
localStorage.setItem("expenses", JSON.stringify(expenses));

document.getElementById("expenseName").value = "";
document.getElementById("expenseAmount").value = "";

loadExpenses();

}

function loadExpenses() {
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let total = expenses.reduce((sum, e) => sum + e.amount, 0);

document.getElementById("totalExpense").innerText = "💰 Total Expense: ₹" + total;

}

// ===== NOTES =====
function saveNote() {
let note = document.getElementById("noteInput").value;
localStorage.setItem("note", note);
loadNote();
}

function loadNote() {
let note = localStorage.getItem("note");
if (note) document.getElementById("savedNote").innerText = note;
}

// ===== DOCUMENTS =====
function saveDocument() {
let file = document.getElementById("documentUpload").files[0];
if (!file) return;

let docs = JSON.parse(localStorage.getItem("docs")) || [];
docs.push(file.name);
localStorage.setItem("docs", JSON.stringify(docs));

loadDocuments();

}

function loadDocuments() {
    let docs = JSON.parse(localStorage.getItem("docs")) || [];
    let list = document.getElementById("docList");
    list.innerHTML = "";

    docs.forEach((d, i) => {
        list.innerHTML += `
            <li>
                ${d}
                <button onclick="editDoc(${i})">✏️</button>
                <button onclick="deleteDoc(${i})">❌</button>
            </li>
        `;
    });
}


function saveMedia() {
let file = document.getElementById("mediaUpload").files[0];
if (!file) return;

let reader = new FileReader();

reader.onload = function () {
    let imageData = reader.result;

    // Save image in localStorage
    localStorage.setItem("userPhoto", imageData);

    // Show preview
    document.getElementById("mediaPreview").innerHTML =
        `<img src="${imageData}" width="120">`;
};

reader.readAsDataURL(file);

}

function editTask(id, oldTask) {
    let newTask = prompt("Edit Task:", oldTask);

    if (!newTask) return;

    fetch(`http://localhost:3000/update-task/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ task: newTask })
    })
    .then(res => res.text())
    .then(data => {
        alert("✏️ Task Updated!");
        loadTasks();
    });
}

function deleteDoc(index) {
    let docs = JSON.parse(localStorage.getItem("docs"));
    docs.splice(index, 1);
    localStorage.setItem("docs", JSON.stringify(docs));
    loadDocuments();
}

function editDoc(index) {
    let docs = JSON.parse(localStorage.getItem("docs"));
    let newName = prompt("Rename file:", docs[index]);

    if (!newName) return;

    docs[index] = newName;
    localStorage.setItem("docs", JSON.stringify(docs));
    loadDocuments();
}


function exportPDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

let y = 20;

// Title
doc.setFontSize(18);
doc.text("Personal Data Report", 20, y);

// ===== ADD PHOTO =====
let photo = localStorage.getItem("userPhoto");
if (photo) {
    doc.addImage(photo, "JPEG", 140, 20, 40, 40);
}

y += 20;

// PROFILE
let profile = JSON.parse(localStorage.getItem("profile"));
if (profile) {
    doc.setFontSize(12);
    doc.text("Name: " + profile.name, 20, y); y += 8;
    doc.text("Email: " + profile.email, 20, y); y += 8;
    doc.text("City: " + profile.city, 20, y); y += 10;
}

// TASKS
doc.text("Tasks:", 20, y); y += 8;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach((t, i) => {
    doc.text((i + 1) + ". " + t, 25, y);
    y += 6;
});

// EXPENSE
// ===== EXPENSE =====
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

y += 5;
doc.text("Expenses:", 20, y);
y += 8;

if (expenses.length === 0) {
doc.text("No expenses added", 25, y);
y += 6;
} else 
expenses.forEach((e, i) => {
let line = (i + 1) + ". " + e.name + " - ₹" + e.amount;
doc.text(line, 25, y);
y += 6;
});

let total = expenses.reduce((sum, e) => sum + e.amount, 0);
y += 5;
doc.text("Total Expense: ₹" + total, 20, y);
y += 10;

}

// ===== LOGOUT =====
function logout() {
localStorage.removeItem("loggedInUser");
window.location.href = "login.html";
}

function exportPDF() {
    const { jsPDF } = window.jspdf;

    html2canvas(document.body).then(canvas => {
        const imgData = canvas.toDataURL("image/png");

        const doc = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save("Dashboard.pdf");
    });
}
// function exportPDF() {
//     const { jsPDF } = window.jspdf;

//     html2canvas(document.body).then(canvas => {
//         const imgData = canvas.toDataURL("image/png");

//         const doc = new jsPDF('p', 'mm', 'a4');

//         const imgWidth = 210;
//         const pageHeight = 295;
//         const imgHeight = canvas.height * imgWidth / canvas.width;

//         doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//         doc.save("Dashboard.pdf");
//     });
