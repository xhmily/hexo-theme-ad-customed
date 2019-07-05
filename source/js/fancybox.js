$(document).ready(function(){
  $("img").each(function(){
    var stra = "<a href='"+this.src+"' data-fancybox></a>";
    $(this).wrapAll(stra);
  });
});
