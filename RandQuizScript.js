setFallbackMode();
if (window.jQuery) {
	// Leave a marker for other script to know not to run
	$(".question").hide();
	var curattempt;
	if ($("#CurAttempt").length === 0 && $("#UserId").length === 0) {
		$('body').append('<div id="CurAttempt" style="display: none;"></div>');
		$('body').append('<div id="UserId" style="display: none;"></div>');
	}
	if ($("#UserId").attr("progress") == null) {
		$("#UserId").attr("progress", "started");
		console.log("Getting whoami");
		$.getJSON("/d2l/api/lp/1.7/users/whoami", function(data) {
			console.log("Got whoami");
			UserId = data.Identifier;
			$("#UserId").html(UserId);
			$("#UserId").attr("progress", "complete");
			selectQuestions();
		});
	}
	if ($("#CurAttempt").first().attr("progress") == null) {
		$("#CurAttempt").attr("progress", "started");
		if (getParameterByName("qi") == null) {
			var quizurl =
				"https://byui.brightspace.com/d2l/lms/quizzing/user/quiz_summary.d2l?qi=" +
				getParameterByName("ci") + "&ou=" + getParameterByName("ou");
		} else {
			var quizurl =
				"https://byui.brightspace.com/d2l/lms/quizzing/user/quiz_summary.d2l?qi=" +
				getParameterByName("qi") + "&ou=" + getParameterByName("ou");
		}
		console.log("Getting Attempt: " + quizurl);
		$.get(quizurl, function(data) {
			console.log("Got Attempt");
			var attemptlabel = $("<div />").html(data).find("#z_m")[0].innerHTML;
			var curattempt = parseInt(attemptlabel.substr(attemptlabel.indexOf(
				"Completed - ") + 12, 2)) + 1;
			if (isNaN(curattempt)) {
				curattempt = 0;
			}
			$("#CurAttempt").html(curattempt);
			$("#CurAttempt").attr("progress", "complete");
			selectQuestions();
		});
	}

	function selectQuestions() {
			console.log("UserId Progress: " + $("#UserId").attr("progress") +
				"CurAttempt Progress: " + $("#CurAttempt").attr("progress"));
			if ($("#UserId").attr("progress") == "complete" && $("#CurAttempt").attr(
				"progress") == "complete") {
				$(".questions").each(function() {
					curattempt = parseInt($("#CurAttempt").html()) + 1;
					questions = $(this).children(".question");
					console.log("UserId" + UserId);
					console.log("CurAttempt" + curattempt);
					console.log("Questions" + questions.length);
					console.log("result" + (UserId * (curattempt)) % questions.length);
					$(questions[(UserId * (curattempt)) % questions.length]).show();
					$(questions).filter("[style='display: none;']").remove();
					$(questions).removeAttr("class");
					$(this).removeAttr("class");
				});
			}
		}
		// Gets a URL param

	function getParameterByName(name) {
		var url = (window.location != window.parent.location) ? document.referrer :
			document.location;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
}
// Vanilla JS function
function setFallbackMode() {
	var allQuestions = document.querySelectorAll(".question");
	for (var i = 0; i < allQuestions.length; i++) {
		allQuestions[i].setAttribute("style", "display: none;")
	}
	var defaultQuestions = document.querySelectorAll(
		".questions .question:first-child");
	for (var i = 0; i < defaultQuestions.length; i++) {
		defaultQuestions[i].setAttribute("style", "display: block;");
	}
}
