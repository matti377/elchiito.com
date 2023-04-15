<?php
include "db.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Retrieve the submitted email and password values
$email = $_POST['email'];
$password = $_POST['password'];

// Connect to the database
$conn = new mysqli($host, $DB_Username, $DB_password, $DB);

// Check for errors in the connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Prepare the SQL statement to insert the new user
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $password);

// Execute the statement and check for errors
if ($stmt->execute()) {
  // Redirect to the allowed.html page if the user was added successfully
  header("Location: signupped.html");
  exit();
} else {
  // Display an error message if the user could not be added
  echo "Error: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
$conn->close();
?>
