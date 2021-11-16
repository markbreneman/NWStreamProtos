window.playerStatusError = false;

$(document).keypress(function(event) {
  if (event.Keycode = 112) {
    if (window.playerStatusError ==false) {
      $('#CoverMessage').hide("slow");
      jwplayer().play()
      // console.log(event.keyCode);
    }
  }
});
