setFallbackMode(); // If all fails, only the first question will be shown.
worked = false; // Checker for if the script failed
if (window.jQuery) { // If JQuery is running
    $(".question").hide(); // Hide all questions
    if ($("#UserID").length === 0) { // Look for an element that contains the UserID
        $.getJSON({ 
            url: "/d2l/api/lp/1.7/users/whoami",
            async: false // As much as I don't like this its the only way to ensure the API is only called once per page.
        }, function (data) {
            $('body').append('<div id="UserID" style="display: none;">' + data.Identifier + '</div>'); // Set the UserID to an element
        });
    }
    if ($("label").length > 0) { // Looks for labels. Labels are used to display time stamp
        if ($("label")[0].innerHTML.indexOf("Written:") === 0) { // Look for a timestamp
            var datestring = $("label")[0].innerHTML.substring(13); // Get the datestring
            var dateT = datestring.substring(0, 2) + "" + parseInt((parseInt(datestring.substring(8, 11)) + 3) / 4); // Generate a DDQ format time stamp. DD is day, Q is quarter of the day.
        } else {
            var curDate = new Date(); // Get current date
            var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
        }
    } else {
        var curDate = new Date();
        var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
    }
    $(".questions").each(function () { // For each question container
        questions = $(this).children(".question"); // Get it's child questions
        UserID = $("div[id='UserID']").first().text(); // Get the UserID
        $(questions[(UserID * (dateT + 1)) % questions.length]).show(); //Display the selected question
        $(questions).filter("[style='display: none;']").remove(); // Remove the hidden questions
        $(questions).removeAttr("class"); // Clean the question
        $(this).removeAttr("class"); // Clean the container
    });
    worked = true; //Function completed successfully
}

setTimeout(function () { // If the function times out
    if (!worked) { // If still failed
        setFallbackMode(); // Run the fallback
    }
}, 3000);

function setFallbackMode() {
    var allQuestions = document.querySelectorAll(".question"); // Get all the questions
    for (var i = 0; i < allQuestions.length; i++) {
        allQuestions[i].setAttribute("style", "display: none;") // Hide all the questions
    }
    var defaultQuestions = document.querySelectorAll(".questions .question:first-child"); // Get the first questions
    for (var i = 0; i < defaultQuestions.length; i++) {
        defaultQuestions[i].setAttribute("style", "display: block;"); // Display the first question
    }
}
