<?php

$email = $_POST['email'];
$code = $_POST['code'];

// Create connection
require_once 'config.php'; // Include file with database connection details
$conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());
mysqli_query($conexion, "SET CHARACTER SET 'utf8'");

$search = mysqli_query($conexion, "SELECT * FROM `accounts` WHERE email = '$email' and password = '$code' ");
if (mysqli_num_rows($search) > 0) {
    $user = mysqli_fetch_row($search);
    $id = $user[0];
    $name = $user[1];
    echo "user=$name " . "email=$email " . "code=$code " . "id=$id ";
    // echo "$user[1]  $email ". $_SESSION['code']; imprimir  variables y session variables
} else {
    echo 0;
}

mysqli_close($conexion);

?>