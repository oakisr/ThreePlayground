<?php
require_once 'config.php'; // Include file with database connection details

// Create connection
$conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or
    die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());

// Set character set
mysqli_query($conexion, "SET CHARACTER SET 'utf8'");

// Echo success message
echo "Conexión a la base de datos establecida correctamente.";

// Close connection
mysqli_close($conexion);
?>