<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    include_once("database.php");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    if(isset($postdata) && !empty($postdata)) {
        $userId = mysqli_real_escape_string($con, trim($request->userId));
        echo 'here';
        $sql = '';
        $sql = "SELECT cps530.products.* FROM cps530.favorites INNER JOIN cps530.products ON cps530.favorites.userId = cps530.products.userId WHERE cps530.favorites.userId = '$userId'";
        if($result = mysqli_query($con,$sql)) {
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