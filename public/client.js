// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
  
  var talkingTo;
  var username="defaultUser";
  
  var emoji=['😄','😅','😌','😵','👽']
  $.get('/users', function(data) {
    talkingTo = data[0].name;
    $('#profilepic').text(emoji[Math.floor(Math.random() * emoji.length)]);
    $('#dreams').html("<b>Hey there!</b> I'm " + talkingTo);
    data.forEach(function(obj) {
      $('<option></option>').attr("value",obj.name).text(obj.name).appendTo('#uName');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var ques = $('input').val();
    $('<div class="rightMsg"></div>').text(ques).appendTo('div#dreams');
    $.post('/dreams?' + $.param({dream: ques, from:talkingTo, to:username}), function(data) {
      $('<div class="leftMsg"></div>').text(data).appendTo('div#dreams');
      var elem = document.getElementById('chatbox');
      elem.scrollTop = elem.scrollHeight;
      $('input').val('');
      $('input').focus();
    });
  });
  var yourSelect = document.getElementById("uName");
  $('#uName').change(function(){
    $('#profilepic').text(emoji[Math.floor(Math.random() * emoji.length)]);
    talkingTo = yourSelect.options[yourSelect.selectedIndex].value;
    $('div#dreams').text("");
    $('#dreams').html("<b>Hey there!</b> I'm " + talkingTo);
  });
});


function newUser(){
  var uName = $('input').val();
  $.get('/newUser?name='+uName)
}

function clearDB(){
  $.get('/clear');
  $('div#dreams').text("");
}
