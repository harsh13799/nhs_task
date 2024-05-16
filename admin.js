var isSubmitClicked = false;

function fetch_data() {
    $.ajax({
        type: "GET",
        url: "http://localhost/nhs/api/rest_api.php?type=patientData",
        contentType: 'application/json',
        success: function (response) {
            // Clear existing data in the table body
            $('#patientDetailsBody').empty();

            if (response.length === 0) {
                $('#noData').show();
            } else {
                response.forEach(function(patient) {
                    let dateSubmitted = new Date(patient.DateSubmitted['date']);
                    let dob = new Date(patient.DateOfBirth['date']);
                    $('#patientDetailsBody').append(
                        '<tr id=' + patient.PatientID + '>' +
                            '<td>' + dateSubmitted.toLocaleDateString() + ' '+ dateSubmitted.toLocaleTimeString()+ '</td>' +
                            '<td>' + patient.FirstName + '</td>' +
                            '<td>' + patient.Surname + '</td>' +
                            '<td>' + patient.Age + '</td>' +
                            '<td>' + dob.toLocaleDateString() + '</td>' +
                            '<td>' + patient.TotalScore + '</td>' +
                        '</tr>'
                    );
                });
                $('#patientDetailsBody tr').click(function() {
                    window.location.href = 'details.html?id=' + this.id;
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

    fetch_data();

    $("#patientForm").submit(function (event) {
        isSubmitClicked = true;
        event.preventDefault();

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
    });
});