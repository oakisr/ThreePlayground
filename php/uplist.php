<?php
    
    $id = $_POST['id'];

    // Create connection
    require_once 'config.php'; // Include file with database connection details
    $conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("No se ha podido conectar al servidor de Base de datos: " . mysqli_connect_error());
    mysqli_query($conexion, "SET CHARACTER SET 'utf8'");
    
    $search = mysqli_query($conexion,"SELECT * FROM `files` WHERE id_user = '$id' ");
    if(mysqli_num_rows($search) > 0) { 
        $total = mysqli_num_rows($search);
        $total = "$total".",";
        for($i=0;$i<mysqli_num_rows($search);$i++){
            $list = mysqli_fetch_row($search);
            $total = "$total"."$i=$list[3]"."$list[2]";
        }
        echo "$total";
    }
    else {
        echo 0;
    }

    mysqli_close($conexion);  

?>