if ($("#CurrentAttempt").length === 0 && $("#UserId").length === 0) {
	$('body').append('<div id="CurrentAttempt" style="display: none;"></div>');
	$('body').append('<div id="UserId" style="display: none;"></div>');
}
if ($("#UserId").attr("progress") == null) {
	$("#UserId").attr("progress", "started");
	$.getJSON("/d2l/api/lp/1.7/users/whoami", function (data) {
		UserId = data.Identifier;
		$("#UserId").html(UserId);
		$("#UserId").attr("progress", "complete");
		selectQuestions();
	});
}
if ($("#CurrentAttempt").first().attr("progress") == null) {
	var curAttempt = $("#CurrentAttempt");
	$(curAttempt).attr("progress", "started");
	if ($('form[action*="quiz_attempt_page"]').length > 0) {
		$(curAttempt).attr("progress", "complete");
		$(curAttempt).html($($(top.document).find("iframe[src*='quiz_start_frame']").contents().find("frame[src*='quiz_attempt_top']")[0]).contents().find("label#z_f").first().html().match(/\d+/)[0]);
		selectQuestions();
	} else if ($("form[action*='quiz_submissions_attempt']").length !== 0) {
		$(curAttempt).html($(".vui-heading-3").first().html().match(/\d+/)[0]);
		$(curAttempt).attr("progress", "complete");
		selectQuestions();
	} else if (getParameterByName("qi") == null) {
		$(curAttempt).html(1);
		$(curAttempt).attr("progress", "complete");
		selectQuestions();
	} else {
		$(curAttempt).attr("progress", "complete");
		$(curAttempt).html("1");
		selectQuestions();
	}
}
function selectQuestions() {
	if ($("#UserId").attr("progress") == "complete" && $("#CurrentAttempt").attr("progress") == "complete") {
		$(".question").hide();
		$(".questions").each(function () {
			questions = $(this).children(".question");
			$(questions[(UserId * parseInt($("#CurrentAttempt").html())) % questions.length]).show();
			$(questions).filter("[style='display: none;']").remove();
			$(questions).removeAttr("class");
			$(this).removeAttr("class");
		});
	}
}
function getParameterByName(name) {
	var url = (window.location != window.parent.location) ? document.referrer : document.location;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
