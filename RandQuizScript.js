if ($("label").length > 0) {
    if ($("label")[0].innerHTML.indexOf("Written:") === 0) {
        var datestring = $("label")[0].innerHTML.substring(13);
        var day = datestring.substring(0, 2);
        var hour = parseInt(datestring.substring(8, 11));
        var dateT = day + "" + parseInt((hour + 3) / 4);
    } else {
        var curDate = new Date();
        var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
    }
} else {
    var curDate = new Date();
    var dateT = curDate.getDate() + "" + parseInt((curDate.getHours() + 3) / 4);
}

questions = $('.question');

var success = false;
$.getJSON("/d2l/api/lp/1.7/users/whoami", function (data) {
    questions.hide();
    var UserID = data.Identifier;
    var Entropy = (UserID * (dateT + 1)) % questions.length;
    if (!success) {
        success = true;
        $(questions[Entropy]).show();
        $(questions).filter("[style='display: none;']").remove();
        $(questions).removeAttr("class");
    }
});
setTimeout(function () {
    if (!success) {
        success = true;
        var Entropy = parseInt(Math.floor((Math.random() * questions.length) + 1));
        $(questions[Entropy]).show(); // Show that element
        $(questions).filter("[style='display: none;']").remove();
        $(questions).removeAttr("class");
    }
}, 5000);
