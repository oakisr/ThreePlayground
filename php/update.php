<?php
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $code = $_POST['code'];
    $id = $_POST['id'];

    // Create connection
    require_once 'config.php'; // Include file with database connection details
    $conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());
    mysqli_query($conexion, "SET CHARACTER SET 'utf8'");

    mysqli_query($conexion,"UPDATE accounts SET name = '$name', email = '$email', password = '$code' WHERE id = '$id' ");
    
    mysqli_close($conexion); 

?>