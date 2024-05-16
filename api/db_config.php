<?php
$serverName = "DHRUV";
$connectionOptions = array(
    "Database" => "nhs",
    "Uid" => "dev",
    "PWD" => "password",
    "Encrypt" => "true",
    "TrustServerCertificate" => "true"
);
try {
    $conn = sqlsrv_connect($serverName, $connectionOptions);
    if ($conn === false) {
        die(print_r(sqlsrv_errors(), true));
    }
} catch (Exception $e) {
    throw new Exception($e->getMessage());   
}

// // Select Query
// $tsql = "SELECT * from Patients";

// // Executes the query
// $stmt = sqlsrv_query($conn, $tsql);
// // Error handling
// if ($stmt === false) {
//     die(formatErrors(sqlsrv_errors()));
// }


// while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
//     echo $row['FirstName'] . PHP_EOL;
// }

// sqlsrv_free_stmt($stmt);
// sqlsrv_close($conn);


?>
