var questions = $('.question');
$("div[class='question']").hide();
$(questions).last().after('<div class="name" style="display: none;">{LastName}</div>');
var Entropy = (($("div.name")[0].innerHTML.charCodeAt("0") * (3 + 3)) - 65) % questions.length; // 3 is where the attempt number will go
$(questions[Entropy]).show();
$(questions).filter("[style='display: none;']").remove();
