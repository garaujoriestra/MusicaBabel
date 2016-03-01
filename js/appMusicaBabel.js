/*****************************
**** DECLARO FUUNCIONES ******
******************************/

//Función que guarda una nueva canción en el servidor
function saveSong(artist_name, song_name, song_url){
	$.ajax({

		method:"POST",
		url:"/api/songs/",
		data: JSON.stringify({
			artist_name:artist_name,
			song_name:song_name,
			song_url: song_url
		}),
		dataType:"json",
		contentType: "application/json",
		
		//Cuando se guarda con éxito, muestro la nueva cancion en la web
		success: function(data){
			//Oculto el cartelito con ayuda al meter la primera canción
			$(".container-ayuda").hide();
			$(".pag-vacia").css("display", "none");
			//$(".pag-songs").css("display", "block");

			var html = "";
			var id = data.id;
			var artist_name = data.artist_name || "";
			var song_name = data.song_name || "";	
			html += "<li>"
			html += "<i class='fa fa-music icono-musica'></i>";
			html += "<span class='info-song-li'> " + artist_name + ' - ' + song_name + "</span>";
			html += '<button class="button-play-li" data-songid= "' + id + '"  ><i class="fa fa-play"></i></button>';
			html += '<button class="button-eliminar-li" data-songid= "' + id + '"  >Eliminar</button>';
			html += '<button data-songid= "' + id + '"  >Modificar</button>';

			html += "</li>";
			$(".songsList").append(html);
			$(".pag-songs").css("display", "block");
		},

		error: function(){
			alert("Se ha producido un error");
		}
	});

};

//Función que pide canciones al servidor para mostrarlas al iniciar la web
function reloadSongs(){
	$.ajax({

		url:"/api/songs/",

		success: function(data){

			if(data.length===0){
				$(".pag-vacia").css("display", "block");

			}else{

				$(".pag-songs").css("display", "block");
				$(".pag-vacia").css("display", "none");
				//Oculto el cartelito con ayuda al meter la primera canción
				$(".container-ayuda").hide();

				for (var i in data){
					var html = "";
					var id = data[i].id;
					console.log(id);
					var artist_name = data[i].artist_name || "";
					var song_name = data[i].song_name || "";	
					html += "<li>"
					html += "<i class='fa fa-music icono-musica'></i>";
					html += "<span class='info-song-li'> " + artist_name + ' - ' + song_name + "</span>";
					html += '<button class="button-play-li" data-songid= "' + id + '"  ><i class="fa fa-play"></i></button>';
					html += '<button class="button-eliminar-li" data-songid= "' + id + '"  >Eliminar</button>';
					html += '<button class="button-modificar-li" data-songid= "' + id + '"  >Modificar</button>';

					html += "</li>";
					$(".songsList").append(html);
				}	
			}
			
		},

		error: function(){
			$(".pag-vacia").css("display", "block");
			$(".pag-songs").css("display", "none");
		}
	});	

};


function deleteSong(id){
	$.ajax({

		method: "delete",
		url:"/api/songs/" + id,
		success: function(){
			$(self).parent().remove();
		}

	});

}



/******************************************************
**** PÁGINA SE CARGA POR COMPLETO *********************
*******************************************************/
$(document).ready(function(){	

	/******************************************************
	**** STARTS: COSAS QUE DEBEN HACERSE AL PRINCIPIO *****
	*******************************************************/

	//Lo primero que hacemos al cargar la pagina es pedir al servidor las canciones que tenemos
	//para mostrarlas en el espacio de la lista
	$(".pag-vacia").css("display", "none");
	$(".pag-songs").css("display", "none");
	reloadSongs();


	/****************************************************
	**** PROGRAMO TODOS LOS MANEJADORES DE EVENTOS ******
	****************************************************/

	//Manejador de eventos: cuando me pulsan al botón(+) para iniciar el formulario de guardar una nueva canción
	$('#button-new-song').click(function () {

		//Muestro el modal
	    $('#modal-new-song-form').modal({
	        show: true
	    });

	    //Inicializo todos los input a vacíos
		$("#name").val("");
		$("#song-name").val("");
		$("#song-url").val("");
		$("#check-rock:checkbox").attr('checked', false);
		$("#check-pop:checkbox").attr('checked', false);
		$("#check-hiphop:checkbox").attr('checked', false);
		$("#check-jazz:checkbox").attr('checked', false);
	});

	//Manejador de eventos: Cuando el model se muestra coloco el focus en el primer input.
	$('#modal-new-song-form').on('shown.bs.modal', function() {
    	$("#name").focus();
	});


	//Manejador de eventos para cuando me clickan el botón de guardar canción en el formulario
	//Aquí valido todos los input del formulario
	$("form").on("submit", function(evt){	
		
		//validación del nombre del artista
		var artist_name = $.trim( $("#name").val() );	//trim quita espacios por delante y por detrás
		if (artist_name == ""){
			alert("El nombre del artista no puede estar vacio");
			return false;	
		};

		//validación del nombre de la canción
		var song_name = $.trim( $("#song-name").val() );
		if (song_name == ""){
			alert("El nombre de la canción no puede estar vacio");
			return false;	
		};

		//validación de la url de la canción
		var song_url = $.trim( $("#song-url").val() );
		if (song_url ==="" || (song_url !="" && false == /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig.test(song_url))){
			alert("La url de la canción no es válida");
			return false;	
		}

		//Una vez validado el formulario, hacemos una petición Ajax para guardar en el servidor
		saveSong(artist_name, song_name, song_url);


		//Para ocultar el modal igual que hace el data-dismiss="modal"
		$('#modal-new-song-form').modal('hide');
		return false;

	});

	//Manejador de eventos para cuando clickan el botón eliminar canción
	$("#list").on("click", ".button-eliminar-li", function(){
		console.log("ELIMINO ");

		var self = this;
		console.log("THIS", $(this));
		var id = $(this).data("songid");
		console.log(id);

		$.ajax({

			method: "delete",
			url:"/api/songs/" + id,
			success: function(){
				$(self).parent().remove();
			}

		});
	});

});