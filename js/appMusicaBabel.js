/*****************************
**** DECLARO FUUNCIONES ******
******************************/

//
//Cuando la página se ha cargado por completo
//
$(document).ready(function(){	

	//Manejador de eventos para cuando me pulsan al botón para iniciar el formulario de guardar una nueva canción
	$("#button-new-song").on("click", function(){	
		// Ponemos el foco en el primer input
		$(".auto-focus").focus();	//NO FUNCIONA EL AUTOFOCUS, DEJO CODIGO PARA LUEGO MIRAR
	});



	//Manejador de eventos para cuando me clickan el botón de guardar canción en el formulario
	$("form").on("submit", function(evt){	
		
		//validación del nombre del artista
		var artist_name = $.trim( $("#name").val() );	//trim quita espacios por delante y por detrás
		if (artist_name == ""){
			alert("El nombre del artista no puede ser vacio");
			return false;	//cancela el evento
		}


		//Para ocultar el modal igual que hace el data-dismiss="modal"
		$('#modal-new-song-form').modal('hide');
		return false;

	});

});