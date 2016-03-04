$(document).ready(function(){   
	$( ".filtro" ).keypress($.debounce(250, function(e) {
	  console.log( "pulsado" );
	}));
});