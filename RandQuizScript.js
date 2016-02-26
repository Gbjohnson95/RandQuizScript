$(".question").hide(); // Hide everything that is question text
if ($("#UserID").length === 0) { // If an elem with a UserID exists, dont call the API again
	$.getJSON({
		url : "/d2l/api/lp/1.7/users/whoami",
		async : false // Only way to ensure that with multiple scripts on the page only call the API once per page
	}, function (data) {
		$('body').append('<div id="UserID" style="display: none;">' + data.Identifier + '</div>'); // Set an element to contain the UserID
	});
}
if ($("label").length > 0) {
	if ($("label")[0].innerHTML.indexOf("Written:") === 0) {
		var datestring = $("label")[0].innerHTML.substring(13); // Label that displays the time of the quiz being taken
		var day = datestring.substring(0, 2); // Pulls the day of month out
		var hour = parseInt(datestring.substring(8, 11)); // Uses parseInt and pulls 3 chars so that if the date is displayed as 9 instead of 09 it still functions
		var dateT = day + "" + parseInt((hour + 3) / 4); // DDQ, where DD is the day, and Q is the quater of the day with an offset of 3 hours
	} else { // If a label is found but not the one that were looking for
		// The + "" + is needed to concat the nums rather than add them
		var curDate = new Date(); //  Get current date
		var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4); // DDQ, where DD is the day, and Q is the quater of the day with an offset of 3 hours
	}
} else {
	// The + "" + is needed to concat the nums rather than add them
	var curDate = new Date(); // Get current date
	var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4); // DDQ, where DD is the day, and Q is the quater of the day with an offset of 3 hours
}
$(".questions").each(function () { // Gets the question blocks
	questions = $(this).children(".question"); // Gets the question text in each of the questions
	if ($("#UserID").length > 0) { // if there is an elem with the user ID then use it for the
		UserID = $("div[id='UserID']").first().text(); // Get the UserID
		$(questions[(UserID * (dateT + 1)) % questions.length]).show(); //  Show the selected question
		$(questions).filter("[style='display: none;']").remove(); // Delete the other questions
		$(questions).removeAttr("class"); // Drop the class for some reason
	} else { // If theres no UserID then the function to get it failed
		console.error("If you're reading this something done broke and random question texts where displayed");
		$(".questions").each(function () {
			questions = $(this).children(".question");
			$(questions[parseInt(Math.floor((Math.random() * questions.length) + 1))]).show();
			$(questions).filter("[style='display: none;']").remove();
			$(questions).removeAttr("class");
		});

	}
});
