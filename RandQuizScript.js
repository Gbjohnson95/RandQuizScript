var questions = $('.question');
$("div[class='question']").hide();
$(questions).last().after('<div class="UserId" style="display: none;">{UserId}</div>');
var Entropy = (($("div.UserId")[0].innerHTML * (3 + 3)) - 65) % questions.length; // 3 is where the attempt number will go
$(questions[Entropy]).show();
$(questions).filter("[style='display: none;']").remove();
