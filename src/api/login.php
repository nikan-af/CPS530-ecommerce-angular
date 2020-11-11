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
        $sql = '';
        $sql = "SELECT * FROM cps530.users where email='$email' and password='$pwd'";
        if($result = mysqli_query($mysqli,$sql)) {
            $rows = array();
            while($row = mysqli_fetch_assoc($result)) {
                $rows[] = $row;
            }
            echo json_encode($rows);
        } else {
            http_response_code(404);
        }
    }
?>