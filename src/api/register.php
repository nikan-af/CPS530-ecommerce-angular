<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    include_once("database.php");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    if(isset($postdata) && !empty($postdata)) {
        $pwd = mysqli_real_escape_string($mysqli, trim($request->password));
        $email = mysqli_real_escape_string($mysqli, trim($request->email));
        $password = mysqli_real_escape_string($mysqli, trim($request->password));
        $fullName = mysqli_real_escape_string($mysqli, trim($request->fullName));
        $sql = '';
        $sql = "INSERT INTO users(email, fullName, password, createdAt) VALUES('$email', '$fullName', '$password', CURRENT_TIME)";
        if($result = mysqli_query($mysqli,$sql)) {
            $sql = "SELECT * FROM cps530.users WHERE email = '$email'";
            if($result1 = mysqli_query($mysqli,$sql)) {
                $rows = array();
                while($row = mysqli_fetch_assoc($result1)) {
                    $rows[] = $row;
                }
                echo json_encode($rows);
            }
        } else {
            http_response_code(404);
        }
    }
?>