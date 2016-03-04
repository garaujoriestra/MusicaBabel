/*****************************
**** VARIABLES GLOBALES ******
******************************/
var infoLi = [];


/*****************************
**** DECLARO FUUNCIONES ******
******************************/


//Función que me recorre la lista li cada vez que se cambia, para obtener información de ella
//y guardarla en un array

function getInfoLi(){
	infoLi = [];
	var i = 0;
	$("#list li").each(function(){
		var string = $(this).find(".info-song-li").text();
		var dicc = {donItem: $(this),
					text: string};

		infoLi[i] = dicc;
		i++;
	});

	
};


/******************************************************
**** PÁGINA SE CARGA POR COMPLETO *********************
*******************************************************/
$(document).ready(function(){	
	console.log("HOLAAAAAA");
});