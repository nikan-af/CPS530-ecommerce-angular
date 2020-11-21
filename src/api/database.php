<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$con=mysqli_init(); 
mysqli_ssl_set($con, NULL, NULL, "BaltimoreCyberTrustRoot.crt.pem", NULL, NULL); 
mysqli_real_connect($con, "cps530.mysql.database.azure.com", "cps530_admin@cps530", "Passwd@1", "cps530", 3306);
 
if ($con->connect_error) {
    die('Error : ('. $con->connect_errno .') '. $con->connect_error);
}
?>