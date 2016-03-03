$(document).ready(function(){  
	if($(window).width() > 480){
		
		setTimeout(function(){
	        $(".loader").fadeOut("slow");
	    }, 1000);	
	}else{
		$(".title-loader").css("display","none");
		setTimeout(function(){
	        $(".loader").fadeOut("slow");
	    }, 1000);
	}
});