/*****************************
**** VARIABLES GLOBALES ******
******************************/

/*****************************
**** DECLARO FUUNCIONES ******
******************************/

//Funcion para pintar una sola canción en pantalla(no reload)
function printSong(id, artist_name, song_name){

	var html = "";
	html += '<li class="draggable-li" data-songid= "' + id + '" >'
	html += "<i class='fa fa-music icono-musica '></i>";
	html += "<span class='info-song-li'><i> " + artist_name + '</i> - <b>' + song_name + "</b></span>";
	html += '<div class="wrapper-buttons-list"><button class="button-play-li icono-lista" data-songid= "' + id + '"  ><i class="fa fa-play icono-reproducir"></i><i class="fa fa-pause icono-reproducir"></i></button>';
	html += '<button class="button-eliminar-li icono-lista" data-songid= "' + id + '"  ><i class="fa fa-trash-o icono-eliminar"></i></button>';
	html += '<button class="button-modificar-li icono-lista" data-songid= "' + id + '"  ><i class="fa fa-pencil-square-o icono-modificar"></i></button></div>';
	html += "</li>";
	$(".songsList").append(html);
};

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
			$(".pag-songs").css("display", "block");
			
			var id = data.id;
			var artist_name = data.artist_name || "";
			var song_name = data.song_name || "";	
			printSong(id, artist_name, song_name);
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
				//Oculto el cartelito con ayuda al meter la primera canción
				$(".container-ayuda").hide();
				$(".pag-vacia").css("display", "none");
				$(".pag-songs").css("display", "block");
				
				for (var i in data){
					var html = "";
					var id = data[i].id;
					var artist_name = data[i].artist_name || "";
					var song_name = data[i].song_name || "";	
					printSong(id, artist_name, song_name);
				}	
			}
		},
		error: function(){
			$(".pag-vacia").css("display", "block");
			$(".pag-songs").css("display", "none");
		}
	});	
};

//Función para hacer un PUT y modificar una canción en la base de datos
function putSong(artist_name, song_name, song_url, inputHidden){

	$.ajax({

		method:"PUT",
		url:"/api/songs/" + inputHidden,
		data: JSON.stringify({
			artist_name:artist_name,
			song_name:song_name,
			song_url: song_url
		}),
		dataType:"json",
		contentType: "application/json",
	
		success: function(data){
			$("#list li").each(function(){
				if($(this).data("songid") == inputHidden){
					$(this).find(".info-song-li").html("<i> " + artist_name + '</i> - <b>' + song_name + "</b>");
				}

			});
		},
		error: function(){
			alert("Se ha producido un error");
		}
	});
};

//Función que borra una canción
function deleteSong(id, self){
	//alert("¿sEstas seguro de querer borrar esta canción?")
	$.ajax({
		method: "delete",
		url:"/api/songs/" + id,
		success: function(){
			$(self).parent().parent().remove();
			if ($(".songsList").children().text() === ""){
				$(".pag-vacia").css("display", "block");
				$(".pag-songs").css("display", "none");
			}
		}
	});
};


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
		$("#inputHidden").val("");
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
		// if (song_url ==="" || (song_url !="" && false == /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ig.test(song_url))){
		if (song_url ===""){
			alert("La url de la canción no es válida");
			return false;	
		}

		var inputHidden = $("#inputHidden").val();
		if (inputHidden != ""){
			console.log("PUT");
			//Hacemos un PUT
			putSong(artist_name, song_name, song_url, inputHidden);
		}else{
			//Hacemos un POST
			console.log("POST");
			//Una vez validado el formulario, hacemos una petición Ajax para guardar en el servidor
			saveSong(artist_name, song_name, song_url);
		}

		


		//Para ocultar el modal igual que hace el data-dismiss="modal"
		$('#modal-new-song-form').modal('hide');
		return false;

	});

	//Manejador de eventos para cuando clickan el botón eliminar canción
	$("#list").on("click", ".button-eliminar-li", function(){
		console.log("ELIMINO");

		var self = this;
		var id = $(this).data("songid");
		deleteSong(id, self);
	});

	$("#list").on("click", ".button-modificar-li", function(){
		console.log("MODIFICO");
		var id = $(this).data("songid");

		$.ajax({

			url:"/api/songs/" + id,
			success: function(data){
				//Muestro el modal
			    $('#modal-new-song-form').modal({
			        show: true
			    });
				var artist_name = data.artist_name || "";
				var song_name = data.song_name || "";	
				var song_url = data.song_url || "";
				$("#myModalLabel").html("Modifica la canción!.");
				$("#name").val(artist_name);
				$("#song-name").val(song_name);
				$("#song-url").val(song_url);
				console.log("ID", id)
				$("#inputHidden").val(id);
			},

			error: function(){
				console.log("ERRRORRRRR");
			}
		});	
	});
});