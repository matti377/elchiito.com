<?php
include "db.php";
// Replace 'your_username' and 'your_password' with your MySQL username and password
$mysqli = new mysqli("host", "DB_Username", "DB_password", "DB");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get email and password from POST data
$email = $_POST["uname"];
$password = $_POST["psw"];

// Prepare a SELECT statement to retrieve the user's password for the entered email
$stmt = $mysqli->prepare("SELECT password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($hashed_password);
$stmt->fetch();
$stmt->close();

// Verify the entered password against the hashed password from the database
if (password_verify($password, $hashed_password)) {
    // Passwords match, so redirect to allowed.html
    header("Location: allowed.html");
} else {
    // Passwords don't match, so redirect to denied.html
    header("Location: denied.html");
}

// Close the database connection
$mysqli->close();
?>
