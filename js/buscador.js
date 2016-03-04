//VARIABLES GLOBALES

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

}
$(document).ready(function(){   
	$( ".filtro" ).keyup($.debounce(250, function(e) {
	  console.log("texto",$(".filtro").val());
	  var datos = $(".filtro").val();
	  normalizarFiltro(datos);
	}));
});