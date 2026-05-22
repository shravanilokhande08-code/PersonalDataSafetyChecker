// ===== REGISTER FUNCTION =====
function registerUser() {
let username = document.getElementById("newUsername").value.trim();
let password = document.getElementById("newPassword").value.trim();
let confirmPassword = document.getElementById("confirmPassword").value.trim();

// Check empty fields
if (username === "" || password === "" || confirmPassword === "") {
    alert("⚠️ Please fill all fields!");
    return false;
}

// Password match check
if (password !== confirmPassword) {
    alert("❌ Passwords do not match!");
    return false;
}

// Password strength (basic)
if (password.length < 6) {
    alert("⚠️ Password must be at least 6 characters!");
    return false;
}

// Check if user already exists
if (localStorage.getItem(username)) {
    alert("❌ Username already exists! Try another.");
    return false;
}

// Save user data
let userData = {
    password: password,
    createdAt: new Date().toLocaleString()
};

localStorage.setItem(username, JSON.stringify(userData));

alert("✅ Registration successful! Please login.");

// Redirect to login page
window.location.href = "login.html";

return false;

}