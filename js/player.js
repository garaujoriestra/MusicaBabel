// VARIABLES GLOBALES
var dobleClick = false;
var currentId;
var pulsado = ["","",0];
var audio = $("#player");   //Variable audio, etiqueda audio del html
var wrapper_audio = $(".wrapper-audio"); 
var Player =  {             //Variable Player, objeto para controlar los posibles eventos
	PlayUrl: function(id,url){
		console.log("play URL", id, url);
		quitarHover(currentId);
		currentId = id;
		cambiarHover(id);
		wrapper_audio.find("source").attr("src", url);
		audio.data("songid",id);
		audio[0].pause();
		audio[0].load(); //suspends and restores all audio element
		audio[0].oncanplaythrough = audio[0].play();
		dobleClick = false;  //vuelvo a poner a false el dobleClick para que una vez hecho no salga siempre.
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
	},
};


var globalAjax = $.ajaxSetup({
	beforeSend: function() {
		$(".loaderAjax").css("display", "block");


	},
  	complete: function(xhr, status) {
        $(".loaderAjax").css("display", "none");
    }
});


function cambiarHover(id){
	$("#list li").each(function(){
		if($(this).data("songid") == id){
			$(this).addClass("active-hover");
			$(".play-pause").addClass("playing-song");
		}
	});
}
function quitarHover(id){
	$("#list li").each(function(){
		if($(this).data("songid") == id){
			$(this).removeClass("active-hover");
		}
	});
}
function quitarPauseHover(){
	var active = $("#list").find(".active");
	$(active).removeClass("active");
}
function cambiarIconoReproducir(id){
	icono.removeClass("fa-play");
	icono.addClass("fa-pause");
}
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

	//Cosas del propio reproductor
	$("audio").on("timeupdate", function(){
		var tiempoActual = Math.floor(audio[0].currentTime);
		var tiempoTotal = Math.floor(audio[0].duration);
		var porcentaje = (tiempoActual/tiempoTotal)*100;
		$("#divBarra").width(porcentaje  + "%");
	});



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
/*		quitarHover(idActual);
*/	});

	//Manejador de eventos cuando me clickan el botón de siguiente
	$(".fa-step-forward").click(function(){
		var idActual = audio.data("songid");
		Player.PlayNext(idActual);
/*		quitarHover(idActual);
*/	});

	//Manejador de eventos cuando me clickan el botón de anterior, doble click para ir a la anterior
	$(".fa-step-backward").dblclick(function(){
		dobleClick = true;
		var idActual = audio.data("songid");
		Player.PlayPrevius(idActual);
/*		quitarHover(idActual);
*/	});

	//Manejador de eventos cuando me clickan el botón de anterior, 1 click para empezar la que está
	$(".fa-step-backward").click($.debounce(250, function(e) {
		if(!dobleClick){
			var id = audio.data("songid");
			obtenerInfo(id,
				function(data){
					Player.PlayUrl(id,data.song_url);
				},
				function(error){
					alert("Se ha producido un error al reproducir la canción");
				}
			);
		}	
	}));
	//Manejador de eventos para reproducir canción con doble click
	$("#list").on("dblclick", "li", function(){
		var id = $(this).data("songid");
/*		quitarHover(currentId);
*/		obtenerInfo(id,
			function(data){
				Player.PlayUrl(id,data.song_url);
			},
			function(error){
				alert("Se ha producido un error al reproducir la canción");
			}
		);
	});
	//Manejador de eventos para cuando me pulsan el play del reproductor
	//Siempre empieza la primera
	$(".play-pause .fa-play").click(function(){
		if(pulsado[0] == "stop"){
			id = pulsado[1];
			pulsado[0] = "";
			pulsado[1] = "";
			obtenerInfo(id,
			function(data){
				Player.PlayUrl(id,data.song_url);
			},
			function(error){
				alert("Se ha producido un error al reproducir la canción");
			});
		}else if (pulsado[0] == "pause"){
			id = pulsado[1];
			$(".play-pause").addClass("playing-song");
			audio[0].currentTime = pulsado[2];
			$("audio").trigger("timeupdate");
			audio[0].play();
		}else{
			reproducirPrimera();
		}
	});
	//Manejador de eventos para me clickan el stop
	$(".fa-stop").click(function(){
		audio[0].pause();
		audio[0].currentTime = 0;
		$("audio").trigger("timeupdate");
		pulsado[0] = "stop";
		pulsado[1] = audio.data("songid");
		$(".play-pause").removeClass("playing-song");
		quitarHover(currentId);
	});

	//Manejador de eventos cuando hacen click en pause
	$(".fa-pause").click(function(){
		audio[0].pause();
		$(".play-pause").removeClass("playing-song");
		pulsado[0] = "pause";
		pulsado[1] = audio.data("songid");
		pulsado[2] = audio[0].currentTime;
		console.log(pulsado[2]);
		quitarPauseHover();
	});

});