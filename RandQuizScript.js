var questions = $('.question');
$("div[class='question']").hide();
$(questions).last().after('<div class="UserId" style="display: none;">{UserId}</div>');
var date = new Date();
var dateTime = date.getDate() + "" + parseInt((date.getHours()+3)/4);
var Entropy = ($("div.UserId")[0].innerHTML * (dateTime + 1)) % questions.length;
$(questions[Entropy]).show();
$(questions).filter("[style='display: none;']").remove();
