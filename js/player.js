// VARIABLES GLOBALES

var audio = $("#player");   //Variable audio, etiqueda audio del html
var wrapper_audio = $(".wrapper-audio"); 
var Player =  {             //Variable Player, objeto para controlar los posibles eventos
	PlayUrl: function(id,url){
		console.log("Metodo PlayUrl: ",id,url);
		wrapper_audio.find("source").attr("src", url);
		audio.data("songid",id);
		audio[0].pause();
		audio[0].load(); //suspends and restores all audio element
		audio[0].oncanplaythrough = audio[0].play();
	},
	PlayNext: function(idActual){
		console.log("Metodo PlayNext   idActual: " ,idActual);
		
		//Compruebo con la idActual que me pasan, quien es el siguiente y lo reproduzco.
		var idNext = siguienteCancionLi(idActual);
		console.log("idNext: ", idNext);
		if( idNext != "" ){
			console.log("Hay una cancion siguiente para reproducir");
			obtenerInfo(idNext,
				function(data){
					Player.PlayUrl(idNext,data.song_url);
				},
				function(error){
					alert("Se ha producido un error al reproducir la canción");
				}
			);
		}else{
			console.log("No hay una cancion siguiente para reproducir asique reproduzco la primera");
			reproducirPrimera();
		}
	}
};

function reproducirPrimera(){
	var idPrimero = $("#list li:first-child").data("songid");
	console.log("Primer hijo", idPrimero);
	obtenerInfo(idPrimero,
		function(data){
			Player.PlayUrl(idPrimero,data.song_url);
		},
		function(error){
			alert("Se ha producido un error al reproducir la canción");
		}
	);
}
function siguienteCancionLi(idActual){
	var nextSong;
	$("#list li").each(function(){
		if($(this).data("songid") == idActual){
			nextSong = $(this).next().data("songid");
			if(nextSong == undefined){
				console.log("undefined");
				nextSong = "";
			}
		}
	});
	return nextSong;
}



//SuccessCallback llamara a una funcion anonima que haga lo que quieras y errorCallback igual pero para cuando sale mal.
function obtenerInfo(id,successCallback,errorCallback){
	console.log("ObetenerInfo : ",id);
	$.ajax({
		method: "get",
		url:"/api/songs/" + id,
		success: successCallback,
		error: errorCallback
	});
}

/******************************************************
**** PÁGINA SE CARGA POR COMPLETO *********************
*******************************************************/
$(document).ready(function(){	
	//Manejador de eventos para cuando clickan el botón reproducir la canción
	$("#list").on("click", ".button-play-li", function(){
		console.log("Han hecho click en el boton de Reproducir de un li");	
		var id = $(this).data("songid");
		obtenerInfo(id,
			function(data){
				Player.PlayUrl(id,data.song_url);
			},
			function(error){
				alert("Se ha producido un error al reproducir la canción");
			}
		);
	});

	//Manejador de eventos para cuando una canción termina
	audio.on("ended", function(){
		console.log("A terminado la cancion, tiene que reproducirse la siguiente");
		var idActual = audio.data("songid");
		console.log("ended",idActual);
		Player.PlayNext(idActual);
	});

});