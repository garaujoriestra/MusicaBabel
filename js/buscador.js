/*****************************
**** VARIABLES GLOBALES ******
******************************/
var infoLi = [];

var filtro_palabras = [];

function normalizarFiltro(datos){
	console.log("Funcion NormalizarFiltro recibe : ", datos);
	filtro_palabras = [];
	var spliteado = datos.split(" ");
	console.log(spliteado.length);
	for (var i = 0; i < spliteado.length; i++) {
		if(spliteado[i] != "")
			filtro_palabras.push(spliteado[i]);
	};

	console.log(filtro_palabras);

};


//Función que me recorre la lista li cada vez que se cambia, para obtener información de ella
//y guardarla en un array

function getInfoLi(){
	infoLi = [];
	var i = 0;
	$("#list li").each(function(){
		var string = $(this).find(".info-song-li").text();
		var dicc = {domItem: $(this),
					text: string};

		infoLi[i] = dicc;
		i++;
	});
};

function mostrarLi(){
	$("#list li").each(function(){
		$(this).show();
	});
};

function compararString(){
	console.log(infoLi[0].text);
	mostrarLi();
	if (infoLi.length != 0){
		console.log("METO");
		for (var i = 0; i < filtro_palabras.length; i++) {
			for (var j = 0; j < infoLi.length; j++){
				var textSearch = filtro_palabras[i];
				var textLi = infoLi[j].text;
				console.log(textSearch, textLi);



				if (textLi.indexOf(textSearch)!= -1){
					console.log("ENCONTRADO");

					
				}else{
					console.log("NO ENCONTRADO");
					infoLi[j].domItem.hide();
				}

			};
		};
	}
};

$(document).ready(function(){   
	$( ".filtro" ).keyup($.debounce(250, function(e) {
	  console.log("texto",$(".filtro").val());
	  var datos = $(".filtro").val();
	  normalizarFiltro(datos);
	  compararString();
	}));
});



