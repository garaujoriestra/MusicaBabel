/*****************************
**** DECLARO FUUNCIONES ******
******************************/

//
//Cuando la página se ha cargado por completo
//
$(document).ready(function(){	


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
		$.ajax({

			method:"POST",
			url:"/api/songs/",
			data: JSON.stringify({
				name:name,
				song_name:song_name,
				song_url: song_url
			}),
			dataType:"json",
			contentType: "application/json",
			

			success: function(){
				alert("Guardado con éxito");
			},

			error: function(){
				alert("Se ha producido un error");
			}

		});



		//Para ocultar el modal igual que hace el data-dismiss="modal"
		$('#modal-new-song-form').modal('hide');
		return false;

	});

});