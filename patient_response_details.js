var isSubmitClicked = false;
var isEditModeOn = false;

function getQueryParam(name) {
    var queryString = window.location.search.substring(1);

    var queryParams = queryString.split('&');

    for (var i = 0; i < queryParams.length; i++) {
        var pair = queryParams[i].split('=');
        if (decodeURIComponent(pair[0]) === name) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}


function updateTotalScore() {
    let reliefScore = $("#relief_score").val() != undefined && $("#relief_score").val() != '' ? parseInt($("#relief_score").val().trim()) : 0;
    let worstPain = $("#worst_pain").val() != undefined && $("#worst_pain").val() != '' ? parseInt($("#worst_pain").val().trim()) : 0;
    let leastPain = $("#least_pain").val() != undefined && $("#least_pain").val() != '' ? parseInt($("#least_pain").val().trim()) : 0;
    let averagePain = $("#average_pain").val() != undefined && $("#average_pain").val() != '' ? parseInt($("#average_pain").val().trim()) : 0;
    let rightNow = $("#right_now").val() != undefined && $("#right_now").val() != '' ? parseInt($("#right_now").val().trim()) : 0;
    let generalActivity = $("#general_activity").val() != undefined && $("#general_activity").val() != '' ? parseInt($("#general_activity").val().trim()) : 0;
    let mood = $("#mood_activity").val() != undefined && $("#mood_activity").val() != '' ? parseInt($("#mood_activity").val().trim()) : 0;
    let walkingAbility = $("#walking_ability").val() != undefined && $("#walking_ability").val() != '' ? parseInt($("#walking_ability").val().trim()) : 0;
    let normalWork = $("#normal_work").val() != undefined && $("#normal_work").val() != '' ? parseInt($("#normal_work").val().trim()) : 0;
    let relationships = $("#relationships_activity").val() != undefined && $("#relationships_activity").val() != '' ? parseInt($("#relationships_activity").val().trim()) : 0;
    let sleep = $("#sleep_activity").val() != undefined && $("#sleep_activity").val() != '' ? parseInt($("#sleep_activity").val().trim()) : 0;
    let enjoyment = $("#enjoyment_activity").val() != undefined && $("#enjoyment_activity").val() != '' ? parseInt($("#enjoyment_activity").val().trim()) : 0;

    // Calculate total score
    let totalScore = reliefScore + worstPain + leastPain + averagePain + rightNow +
        generalActivity + mood + walkingAbility + normalWork +
        relationships + sleep + enjoyment;

    // Update total score display
    $("#total_score").text(totalScore);
}

function submit_data(data) {
    $.ajax({
        type: "POST",
        url: "http://localhost/nhs/api/rest_api.php?type=update",
        contentType: 'application/json',
        data: JSON.stringify({
            data: data
        }),
        success: function (response) {
            // Handle success response
            alert("Date updated successfully");
            console.log("Form submitted successfully " + response);
        },
        error: function (xhr, status, error) {
            // Handle error response
            alert("Error submitting form:", error);
            console.error("Error submitting form:", error);
        },
    });
}

function delete_data(id) {
    $.ajax({
        type: "POST",
        url: "http://localhost/nhs/api/rest_api.php?type=delete&id"+id,
        contentType: 'application/json',
        success: function (response) {
            // Handle success response
            alert("Date deleted successfully");
            console.log("Form submitted successfully " + response);
        },
        error: function (xhr, status, error) {
            // Handle error response
            alert("Error submitting form:", error);
            console.error("Error submitting form:", error);
        },
    });
}

function fetch_patient_data(id) {
    $.ajax({
        type: "GET",
        url: "http://localhost/nhs/api/rest_api.php?type=patientResponseData&id=" + id,
        contentType: 'application/json',
        success: function (response) {

            if (response.length === 0) {
                $('#noData').show();
            } else {
                response.forEach(function (patientData) {
                    let dob = new Date(patientData.DateOfBirth['date']);

                    $("#fname").val(patientData.FirstName);
                    $("#sname").val(patientData.Surname);
                    $("#dob").val(dob.getFullYear() + '-' + String(dob.getMonth() + 1).padStart(2, '0') + '-' + String(dob.getDate()).padStart(2, '0'));
                    $("#age").val(patientData.Age)
                    $("#relief_score").val(patientData.ReliefScore)
                    $("#worst_pain").val(patientData.WorstPain)
                    $("#least_pain").val(patientData.LeastPain)
                    $("#average_pain").val(patientData.AveragePain)
                    $("#right_now").val(patientData.CurrentPain)
                    $("#general_activity").val(patientData.GeneralActivity)
                    $("#mood_activity").val(patientData.Mood)
                    $("#walking_ability").val(patientData.WalkingAbility)
                    $("#normal_work").val(patientData.NormalWork)
                    $("#relationships_activity").val(patientData.Relationships)
                    $("#sleep_activity").val(patientData.Sleep)
                    $("#enjoyment_activity").val(patientData.EnjoymentOfLife)
                    $("#total_score").val(patientData.TotalScore)

                });
            }
            console.log("patient data fetched successfully" + response);
        },
        error: function (xhr, status, error) {
            alert("Error while fetching patient data", error);
            console.error("Error while fetching patient data ", error);
        },
    });
}


$(document).ready(function () {
    const paramValue = getQueryParam('id');

    fetch_patient_data(paramValue);

    $("#dob").focusout(function () {
        let dob = $('#dob').val();
        if (dob != '') {
            dob = new Date(dob);
            let today = new Date();
            let dayDiff = Math.ceil(today - dob) / (365.25 * 24 * 60 * 60 * 1000);
            let age = parseInt(dayDiff);
            $('#age').val(age);
        }
    });

    $(".form-control").blur(function () {
        if (!isSubmitClicked)
            updateTotalScore();
    });

    $("#patientForm").submit(function (event) {
        event.preventDefault();

        let submitType = $(this).find('button[type="submit"]:focus').val();

        switch (submitType) {
            case 'edit':
                $('input').prop('readonly', false);
                $('html, body').animate({ scrollTop: 0 }, 'slow');

                $('#edit_btn').hide();
                $('#delete_btn').hide();
                $('#submit_btn').show();

                break;
            case 'delete':
                delete_data(paramValue);
                break;
            case 'save':
                isSubmitClicked = true;

                let firstName = $("#fname").val().trim();
                let surname = $("#sname").val().trim();
                let dob = $("#dob").val().trim();
                let age = parseInt($("#age").val().trim());

                let reliefScore = parseInt($("#relief_score").val());
                let worstPain = parseInt($("#worst_pain").val());
                let leastPain = parseInt($("#least_pain").val());
                let averagePain = parseInt($("#average_pain").val());
                let rightNow = parseInt($("#right_now").val());
                let generalActivity = parseInt($("#general_activity").val());
                let mood = parseInt($("#mood_activity").val());
                let walkingAbility = parseInt($("#walking_ability").val());
                let normalWork = parseInt($("#normal_work").val());
                let relationships = parseInt($("#relationships_activity").val());
                let sleep = parseInt($("#sleep_activity").val());
                let enjoyment = parseInt($("#enjoyment_activity").val());
                let totalScore = parseInt($("#total_score").text());

                if (firstName === "" || surname === "" || dob === "" || age === "") {
                    alert("Please fill the patient details.");
                    return;
                } else if (isNaN(reliefScore) || reliefScore < 0 || reliefScore > 100 ||
                    isNaN(worstPain) || worstPain < 0 || worstPain > 10 ||
                    isNaN(leastPain) || leastPain < 0 || leastPain > 10 ||
                    isNaN(averagePain) || averagePain < 0 || averagePain > 10 ||
                    isNaN(rightNow) || rightNow < 0 || rightNow > 10 ||
                    isNaN(generalActivity) || generalActivity < 0 || generalActivity > 10 ||
                    isNaN(mood) || mood < 0 || mood > 10 ||
                    isNaN(walkingAbility) || walkingAbility < 0 || walkingAbility > 10 ||
                    isNaN(normalWork) || normalWork < 0 || normalWork > 10 ||
                    isNaN(relationships) || relationships < 0 || relationships > 10 ||
                    isNaN(sleep) || sleep < 0 || sleep > 10 ||
                    isNaN(enjoyment) || enjoyment < 0 || enjoyment > 10) {
                    alert("Please enter valid values for all fields.");
                    return;
                }

                let data = {
                    firstName: firstName,
                    surname: surname,
                    dob: dob,
                    age: age,
                    reliefScore: reliefScore,
                    worstPain: worstPain,
                    leastPain: leastPain,
                    averagePain: averagePain,
                    rightNow: rightNow,
                    generalActivity: generalActivity,
                    mood: mood,
                    walkingAbility: walkingAbility,
                    normalWork: normalWork,
                    relationships: relationships,
                    sleep: sleep,
                    enjoyment: enjoyment,
                    totalScore: totalScore
                };

                submit_data(data);
                break;
            default:
                break;
        }
    });
});