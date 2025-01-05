
$(document).ready(function(){

    $('#loading').css('display','none');
  
    $('.sharedNav .bar').click(function(){
  
      if($('.list-nav').hasClass('shownav')){
        $('.list-nav').addClass('hidenav');
        $('.list-nav').removeClass('shownav');
  
      }else{
        $('.list-nav').addClass('shownav');
        $('.list-nav').removeClass('hidenav');
      }
  
    });
  
  
  });
  
  
  
  
  