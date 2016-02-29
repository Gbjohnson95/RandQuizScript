setFallbackMode();
worked = false;
if (window.jQuery) {
	$(".question").hide();
	if ($("#UserID").length === 0) {
		$.getJSON({
			url : "/d2l/api/lp/1.7/users/whoami",
			async : false
		}, function (data) {
			$('body').append('<div id="UserID" style="display: none;">' + data.Identifier + '</div>');
		});
	}
	if ($("label").length > 0) {
		if ($("label")[0].innerHTML.indexOf("Written:") === 0) {
			var datestring = $("label")[0].innerHTML.substring(13);
			.var dateT = datestring.substring(0, 2) + "" + parseInt((parseInt(datestring.substring(8, 11)) + 3) / 4);
		} else {
			var curDate = new Date();
			var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
		}
	} else {
		var curDate = new Date();
		var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
	}
	$(".questions").each(function () {
		questions = $(this).children(".question");
		UserID = $("div[id='UserID']").first().text();
		$(questions[(UserID * (dateT + 1)) % questions.length]).show();
		$(questions).filter("[style='display: none;']").remove();
		$(questions).removeAttr("class");
		$(this).removeAttr("class");
	});
	worked = true;
}
setTimeout(function () {
	if (!worked) {
		setFallbackMode();
	}
}, 3000);
function setFallbackMode() {
	var allQuestions = document.querySelectorAll(".question");
	for (var i = 0; i < allQuestions.length; i++) {
		allQuestions[i].setAttribute("style", "display: none;")
	}
	var defaultQuestions = document.querySelectorAll(".questions .question:first-child");
	for (var i = 0; i < defaultQuestions.length; i++) {
		defaultQuestions[i].setAttribute("style", "display: block;");
	}
}
