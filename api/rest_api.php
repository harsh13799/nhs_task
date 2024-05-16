<?php
require_once 'db_config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');

function get_method () {
	return $_SERVER['REQUEST_METHOD'];
}

function get_request_data() {
	return array_merge(empty($_POST) ? array() : $_POST, (array) json_decode(file_get_contents('php://input'), true), $_GET);
}

function send_response ($response, $code = 200) {
	http_response_code($code);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
	die(json_encode($response));
}

function wh_log($log_msg)
{
    $log_filename = "log";
    if (!file_exists($log_filename)) 
    {
        // create directory/folder uploads.
        mkdir($log_filename, 0777, true);
    }
    $log_file_data = $log_filename.'/log_' . date('d-M-Y') . '.log';
    // if you don't add `FILE_APPEND`, the file will be erased each time you add a log
    file_put_contents($log_file_data, $log_msg . "\n", FILE_APPEND);
} 

$method = get_method();

switch($method){
    
    case "GET" : {
        if(isset($_SERVER['QUERY_STRING'])) {
            $queries = array();
            parse_str($_SERVER['QUERY_STRING'], $queries);
            if(isset($queries['type']) && $queries['type'] == 'patientData'){
                fetch_patient_data($conn);
            } else if(isset($queries['type']) && isset($queries['id']) && $queries['type'] == 'patientResponseData'){
                fetch_patient_reseponse_details($conn, $queries['id']);
            } else {
                send_response([
                    'status' => 'success',
                    'data' => "Welcome to NHS REST API",
                ]);  
            }
       } 
       break;
    }
    case "POST" : {
       if(isset($_SERVER['QUERY_STRING'])) {
        $queries = array();
        parse_str($_SERVER['QUERY_STRING'], $queries);
        if(isset($queries['type']) && $queries['type'] == 'submit'){
            submit_data($conn, false);
        } else if(isset($queries['type']) && $queries['type'] == 'update'){
            submit_data($conn, true);
        } else if(isset($queries['type']) &&  isset($queries['id']) && $queries['type'] == 'delete'){
            delete_patient_response_details($conn, $queries['id']);
            delete_patient_details($conn, $queries['id']);
        } else {
            send_response([
                'status' => 'success',
                'data' => "Welcome to NHS REST API",
            ]); 
        }
        break;
       } 
    }
    default:{
        send_response([
            'status' => 'success',
            'data' => "Welcome to NHS REST API",
        ]); 
        break;
    }
}

function submit_data($conn, $isUpdateData) {
    $data = get_request_data();

    $requiredParams = array(
        'firstName', 
        'surname', 
        'dob', 
        'age',  
        'reliefScore', 
        'worstPain', 
        'leastPain', 
        'averagePain', 
        'rightNow', 
        'generalActivity', 
        'mood', 
        'walkingAbility', 
        'normalWork', 
        'relationships', 
        'sleep', 
        'enjoyment',
        'totalScore'
    );

    if($isUpdateData){
        array_push($requiredParams, 'patientId')
    }

    foreach ($requiredParams as $param) {
        if (!isset($data['data'][$param]) || empty($data['data'][$param])) {
            http_response_code(400);
            send_response([
                'status' => 'fail',
                'data' => "Missing required parameter: $param",
            ], 400); 
            exit();
        }
    }
    
    // $now = new DateTime();

    // $age = $now->diff($dateOfBirth)->y;

    // $totalScore = 0;

    $param = array(
        $data['data']['firstName'],
        $data['data']['surname'],
        $data['data']['dob'],
        $data['data']['age'],
        new DateTime(),
        $data['data']['reliefScore'],
        $data['data']['worstPain'],
        $data['data']['leastPain'],
        $data['data']['averagePain'],
        $data['data']['rightNow'],
        $data['data']['generalActivity'],
        $data['data']['mood'],
        $data['data']['walkingAbility'],
        $data['data']['normalWork'],
        $data['data']['relationships'],
        $data['data']['sleep'],
        $data['data']['enjoyment'],
        $data['data']['totalScore']);

    if($isUpdateData) {
        $patientId = $data['data']['patientId'];
        $sql = "EXEC UpdatePatientDataAndResponse ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
        array_push($param, $patientId)
    } else {
        $sql = "EXEC InsertPatientDataAndResponse ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?";
    }

    $stmt = sqlsrv_query($conn, $sql, $param);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array("status" => 0, "message" => "Something went wrong. Please try again later. " . sqlsrv_errors()));
    } else {
        $response = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        sqlsrv_free_stmt($stmt);
        echo send_response($response);
    }
}

function fetch_patient_data($conn){

    $sql = "SELECT p.*, pr.DateSubmitted, pr.TotalScore FROM Patients AS p INNER JOIN PatientsResponse AS pr ON p.PatientID = pr.PatientID ORDER BY pr.DateSubmitted DESC";
    $stmt = sqlsrv_query($conn, $sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array("status" => 0, "message" => "Something went wrong while fetching patient details. Please try again later. " . sqlsrv_errors()));
    } else {
        $data = array();
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $data[] = $row;
        }
        sqlsrv_free_stmt($stmt);
        echo json_encode($data);
    }
}

function fetch_patient_reseponse_details($conn, $id){

    $sql = "SELECT * FROM Patients INNER JOIN PatientsResponse ON Patients.PatientID = PatientsResponse.PatientID WHERE Patients.PatientID = $id";
    $stmt = sqlsrv_query($conn, $sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array("status" => 0, "message" => "Something went wrong while fetching patient response details. Please try again later. " . sqlsrv_errors()));
    }
    $data = array();
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $data[] = $row;
        }
        sqlsrv_free_stmt($stmt);
        echo json_encode($data);
}

function delete_patient_response_details($conn, $id){

    $sql = "DELETE FROM PatientsResponse WHERE PatientID = $id";
    $stmt = sqlsrv_query($conn, $sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array("status" => 0, "message" => "Something went wrong while fetching patient response details. Please try again later. " . sqlsrv_errors()));
    }
    $data = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $data[] = $row;
    }
    sqlsrv_free_stmt($stmt);
    echo json_encode($data);
}

function delete_patient_details($conn, $id){

    $sql = "DELETE FROM Patients WHERE PatientID = $id";
    $stmt = sqlsrv_query($conn, $sql);

    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(array("status" => 0, "message" => "Something went wrong while fetching patient response details. Please try again later. " . sqlsrv_errors()));
    }
    $data = array();
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $data[] = $row;
    }
    sqlsrv_free_stmt($stmt);
    echo json_encode($data);
}

?>