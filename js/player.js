// VARIABLES GLOBALES

var audio = $("#player");   //Variable audio, etiqueda audio del html
var wrapper_audio = $(".wrapper-audio"); 
var Player =  {             //Variable Player, objeto para controlar los posibles eventos
	PlayUrl: function(id,url){
		console.log("play URL", id, url);
		wrapper_audio.find("source").attr("src", url);
		audio.data("songid",id);
		audio[0].pause();
		audio[0].load(); //suspends and restores all audio element
		audio[0].oncanplaythrough = audio[0].play();
	},
	PlayNext: function(idActual){
		var idNext = siguienteCancionLi(idActual);
		if( idNext != "" ){
			obtenerInfo(idNext,
				function(data){
					Player.PlayUrl(idNext,data.song_url);
				},
				function(error){
					alert("Se ha producido un error al reproducir la canción");
				}
			);
		}else{
			reproducirPrimera();
		}
	},
	PlayPrevius: function(idActual){

		//Compruebo con la idActual que me pasan, quien es el anterior y lo reproduzco.
		var self = this;
		var idPrev = anteriorCancionLi(idActual);
		if( idPrev != "" ){
			obtenerInfo(idPrev,
				function(data){
					Player.PlayUrl(idPrev,data.song_url);
				},
				function(error){
					alert("Se ha producido un error al reproducir la canción");
				}
			);
		}else{
			reproducirPrimera();
		}
	}
};

function anteriorCancionLi(idActual){
	var prevSong = "";
	$("#list li").each(function(){
		if($(this).data("songid") == idActual){
			prevSong = $(this).prev().data("songid");
		}
	});
	if (prevSong == undefined){
		prevSong ="";
	}
	return prevSong;

};

function reproducirPrimera(){
	var idPrimero = $("#list li:first-child").data("songid");
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
				nextSong = "";
			}
		}
	});
	return nextSong;
};



//SuccessCallback llamara a una funcion anonima que haga lo que quieras y errorCallback igual pero para cuando sale mal.
function obtenerInfo(id,successCallback,errorCallback){
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
		var idActual = audio.data("songid");
		Player.PlayNext(idActual);
	});

	//Manejador de eventos cuando me clickan el botón de siguiente
	$(".fa-step-forward").click(function(){
		var idActual = audio.data("songid");
		Player.PlayNext(idActual);
	});

	//Manejador de eventos cuando me clickan el botón de anterior, doble click para ir a la anterior
	$(".fa-step-backward").dblclick(function(){
		var idActual = audio.data("songid");
		Player.PlayPrevius(idActual);
	});

	//Manejador de eventos cuando me clickan el botón de anterior, 1 click para empezar la que está
	$(".fa-step-backward").click(function(){
		var id = audio.data("songid");
		obtenerInfo(id,
			function(data){
				Player.PlayUrl(id,data.song_url);
			},
			function(error){
				alert("Se ha producido un error al reproducir la canción");
			}
		);
	});

	//Manejador de eventos para reproducir canción con doble click
	$("#list").on("dblclick", "li", function(){
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

});