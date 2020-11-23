<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("database.php");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

if (isset($postdata) && !empty($postdata)) {
    $userId = mysqli_real_escape_string($con, trim($request->userId));
    $productId = mysqli_real_escape_string($con, trim($request->productId));

    $sql = "INSERT INTO favorites(userId, productId) VALUES('$userId', '$productId')";
    $result = mysqli_query($con, $sql);
    if (!$result) {
        die('Invalid Query: ' . $con->error);
    }

    if ($result != 1) {
        http_response_code(404);
    }
    http_response_code(200);
}
?>