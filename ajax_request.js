var isSubmitClicked = false;

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
        url: "http://localhost/nhs/api/rest_api.php?type=submit",
        contentType: 'application/json',
        data: JSON.stringify({
            data: data
        }),
        success: function (response) {
            alert("Form submitted successfully!");
            console.log("Form submitted successfully." + JSON.parse(Object.values(response)[0]));
        },
        error: function (xhr, status, error) {
            alert("Error submitting form:", error);
            console.error("Error submitting form:", error);
        },
    });
}


$(document).ready(function () {
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