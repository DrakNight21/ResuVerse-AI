<?php
$host = 'localhost';     // Use your DB host
$user = 'root';          // Your DB username
$pass = '';              // Your DB password
$dbname = 'resume_login';  // Replace with your DB name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
