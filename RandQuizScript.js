// GOALS
// - Shouldn't count on JS hacks and tricks.
// - As completely easy to impliment as possible. Shouldn't need a unique ID for every set of questions. A container DIV may be needed.
// - Script should be as small as possible.

// TO-DO
// - Script only works with one question displayed. Needs a method to only filter one set of possible questions at a time. Unavoidable
//   on results view.
// - Try and make the UserID API call once, then store it as a variable on the page.

// Check for a label that is located on the review page that says what time the quiz was taken
// I do NOT like this function, relies on BS not changing anything.
if ($("label").length > 0) {
    if ($("label")[0].innerHTML.indexOf("Written:") === 0) { // Label in question has the started date.
        var datestring = $("label")[0].innerHTML.substring(13);
        var day = datestring.substring(0, 2);
        var hour = parseInt(datestring.substring(8, 11));
        var dateT = day + "" + parseInt((hour + 3) / 4);
    } else { // If a label is found, but not the one with the time, just use the current time
        var curDate = new Date();
        var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
    }
} else { // if no labels are found, just use the current time
    var curDate = new Date();
    var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
}

questions = $('.question'); // Populate the questions
questions.hide(); // Hide all the questions
var success = false; // Preset the success

// Get the UserID. First iteration of this script used a replace string, but when hosting the script outside of BS script has trouble 
// actualy displaying the replacestring, so API it is. 
$.getJSON("/d2l/api/lp/1.7/users/whoami", function (data) {
    var UserID = data.Identifier; // Get the UserID
    var Entropy = (UserID * (dateT + 1)) % questions.length; // Generate a sorta random #.
    if (!success) { // If the timout function hasnt run yet
        success = true; // Make sure the timeout function doesn't run.
        $(questions[Entropy]).show(); // Show the selected question
        $(questions).filter("[style='display: none;']").remove(); // Drop the other elements
        $(questions).removeAttr("class"); // Clean up element. Students should be completely blind on this.
    }
});

// If the function above fails to get the json in under 5 seconds, just pick one at random.
setTimeout(function () {
    if (!success) {
        success = true;
        var Entropy = parseInt(Math.floor((Math.random() * questions.length) + 1));
        $(questions[Entropy]).show(); // Show that element
        $(questions).filter("[style='display: none;']").remove();
        $(questions).removeAttr("class");
    }
}, 5000);
