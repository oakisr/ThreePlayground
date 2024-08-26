<?php

$id = 0;
$id_user = $_POST['id'];
$model = $_POST['model'];

require_once 'config.php'; // Include file with database connection details
$conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());
mysqli_query($conexion, "SET CHARACTER SET 'utf8'");

$search = mysqli_query($conexion, "SELECT * FROM `files` WHERE id_user = '$id_user' and model = '$model' ");

if (mysqli_num_rows($search) > 0) {
    $list = mysqli_fetch_row($search);
    $id = $list[0];
    $root = "escenes/" . trim($id_user) . "_" . "$id" . ".json";
    echo $root;
} else {
    echo 0;
}

mysqli_close($conexion);

?>