<?php
$servername = "mytunes-db.chtiwrmirtgm.us-west-1.rds.amazonaws.com";
$username = "admin";
$password = "RIPtylin";
$userId = $_POST['user'];

// Create connection
$conn = new mysqli($servername, $username, $password);

$selectRefreshToken = 'SELECT refresh_token FROM my_tunes.user_profile_entity WHERE user_id = \'' . $userId . '\';';
$result = $conn->query($selectRefreshToken);

echo json_encode($result->fetch_assoc());
?>
