// ===== SHOW / HIDE PASSWORD =====
function togglePassword() {
let pass = document.getElementById("password");
pass.type = (pass.type === "password") ? "text" : "password";
}

// ===== LOGIN FUNCTION =====
function loginUser() {
let username = document.getElementById("username").value.trim();
let password = document.getElementById("password").value.trim();

// Check if user exists
let storedUser = localStorage.getItem(username);

if (storedUser === null) {
    alert("❌ User not found! Please register first.");
    return false;
}

let userData = JSON.parse(storedUser);

// Check password
if (userData.password === password) {
    alert("✅ Login successful!");

    // Save logged-in user
    localStorage.setItem("loggedInUser", username);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
} else {
    alert("❌ Incorrect password!");
}

return false;

}