        success = false;
        $(".question").hide();
        if ($("#CurAttempt").length === 0 && $("#UserId").length === 0) {
            $('body').append('<div id="CurAttempt" style="display: none;"></div>');
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
        if ($("#CurAttempt").first().attr("progress") == null) {
            $("#CurAttempt").attr("progress", "started");
            if (false) {
                $("#CurAttempt").html($(".vui-heading-3").first().html());
                selectQuestions();
            } else {
                if (getParameterByName("qi") == null) {
                    var quizurl = "https://byui.brightspace.com/d2l/lms/quizzing/user/quiz_summary.d2l?qi=" + getParameterByName("ci") + "&ou=" + getParameterByName("ou");
                } else {
                    var quizurl = "https://byui.brightspace.com/d2l/lms/quizzing/user/quiz_summary.d2l?qi=" + getParameterByName("qi") + "&ou=" + getParameterByName("ou");
                }
                $.get(quizurl, function (data) {
                    var attemptlabel = $("<div />").html(data).find("#z_m")[0].innerHTML;
                    var curattempt = parseInt(attemptlabel.substr(attemptlabel.indexOf("Completed - ") + 12, 2)) + 1;
                    if (isNaN(curattempt)) {
                        curattempt = 0;
                    }
                    $("#CurAttempt").html(curattempt + 1);
                    $("#CurAttempt").attr("progress", "complete");
                    selectQuestions();
                });
            }
        }

        function selectQuestions() {
            if ($("#UserId").attr("progress") == "complete" && $("#CurAttempt").attr("progress") == "complete" && !success) {
                success = true;
                $(".questions").each(function () {
                    questions = $(this).children(".question");
                    $(questions[(UserId * parseInt($("#CurAttempt").html())) % questions.length]).show();
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

        setTimeout(function () {
            if (!success) {
                success = true;
            }
        }, 1500);
