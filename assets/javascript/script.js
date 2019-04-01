// Ensures that the DOM is ready before executing any JavaScript

$(document).ready(function () {

    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyCk1wNWib0CcKeWUxoGtDC9WgoH-q5bCwg",
        authDomain: "trainschedule-a3d03.firebaseapp.com",
        databaseURL: "https://trainschedule-a3d03.firebaseio.com",
        projectId: "trainschedule-a3d03",
        storageBucket: "trainschedule-a3d03.appspot.com",
        messagingSenderId: "43127665942"
    };

    firebase.initializeApp(config);

    // This variable will reference the database

    var database = firebase.database();

    // Function for current time

    function currentTime() {
        var current = moment().format('LT');
        $("#currentTime").html(current);
        setTimeout(currentTime, 1000);
    };

    // When clicking the submit button, the snapshot function will run.

    $("#submit").on("click", function () {

        // Prevents the page from refreshing

        event.preventDefault();

        // Obtains the user input

        var train = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTime = moment($("#first-train").val().trim(), "HH:mm").format("HH:mm");
        var frequency = $("#frequency").val().trim();

        // Creates temporary object for holding the inputs

        var newTrain = {
            train: train,
            destination: destination,
            first: firstTime,
            frequency: frequency
        };

        // Sets the new values into the database

        database.ref().push(newTrain);

        // Clears the inputs from the form

        $("#train-name").val(" ");
        $("#destination").val(" ");
        $("#first-train").val(" ");
        $("#frequency").val(" ");
    });

    // Adds the train information to the database

    database.ref().on("child_added", function (childSnapshot) {

        // Stores into a variable

        var train = childSnapshot.val().train;
        var destination = childSnapshot.val().destination;
        var firstTime = childSnapshot.val().first;
        var frequency = childSnapshot.val().frequency;

        // Variable to find the converted train time

        var convertedTrainTime = moment(firstTime, "HH:mm").subtract(1, "years");

        // Time calculation variables

        var timeDifference = moment().diff(moment(convertedTrainTime), "minutes");

        var tRemainder = timeDifference % frequency;

        var mintuesAway = frequency - tRemainder;

        var nextArrival = moment().add(mintuesAway, "minutes").format("HH:mm a");

        // Creates the table for the train information

        $("#train-table > tbody").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" +
            frequency + "</td><td>" + nextArrival + "</td><td>" + mintuesAway + "</td></tr>");
    });

    currentTime();

});