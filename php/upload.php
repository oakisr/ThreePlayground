<?php

$id = 0;
$id_user = $_POST['id'];
$model = $_POST['model'];
$file = $_POST['file'];
$date = $_POST['date'];

// Create connection
require_once 'config.php'; // Include file with database connection details
$conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());
mysqli_query($conexion, "SET CHARACTER SET 'utf8'");

$search = mysqli_query($conexion, "SELECT * FROM `files` WHERE id_user = '$id_user' and model = '$model' ");
if (mysqli_num_rows($search) > 0) {
    mysqli_query($conexion, "UPDATE `files` SET `date`='$date' WHERE id_user = '$id_user' and model = '$model' ");
} else {
    mysqli_query($conexion, "INSERT INTO `files` (id_user,model,date) VALUES ('$id_user','$model','$date')");
    $search = mysqli_query($conexion, "SELECT * FROM `files` WHERE id_user = '$id_user' and model = '$model' ");
}

if (mysqli_num_rows($search) > 0) {
    $list = mysqli_fetch_row($search);
    $id = $list[0];

    $root = "../escenes/" . trim($id_user) . "_" . "$id" . ".json";
    $archivo = fopen($root, "w");    // Abrir el archivo, creándolo si no existe:
    if ($archivo == false) {
        echo "Error al crear el archivo";
    } else {
        // Escribir en el archivo:
        fwrite($archivo, $file);
        // Fuerza a que se escriban los datos pendientes en el buffer:
        fflush($archivo);
    }
    // Cerrar el archivo:
    fclose($archivo);
}

mysqli_close($conexion);

?>