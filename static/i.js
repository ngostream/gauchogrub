const main = () =>{
    $(".textOnlyShadow").hover(
        function() {
          
          $( this ).addClass("cardShadow");
        }, function() {
          
          $( this ).removeClass("cardShadow");
        }
      );
}

$(document).ready(main);