<?php
    
    $name = $_POST['name'];
    $email = $_POST['email'];
    $code = $_POST['code'];

    // Create connection
    require_once 'config.php'; // Include file with database connection details
    $conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());
    mysqli_query($conexion, "SET CHARACTER SET 'utf8'");

    $search = mysqli_query($conexion,"SELECT * FROM `accounts` WHERE email = '$email' ");
    if(mysqli_num_rows($search) == 0) { 
        mysqli_query($conexion,"INSERT INTO `accounts` (name,email,password) VALUES ('$name','$email','$code')");
         
        $search = mysqli_query($conexion,"SELECT * FROM `accounts` WHERE email = '$email' and password = '$code' ");
        if(mysqli_num_rows($search) > 0) { 
            $user = mysqli_fetch_row($search);
            $id  = $user[0];
        }

        echo "user=$name"."mail=$email"."code=$code"."id=$id";
    }
    else { echo 0; }
    
    mysqli_close($conexion);  

?>