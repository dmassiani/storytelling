
(function($, ajaxurl){

	$rapper 	= 'story__rapper',
	$selector 	= 'story__selector';
	var n__post 		= 0;

	var n__metabox 		= 0;
	var n__element 		= 0;

	var file_frame;

	// ajaxurl est fourni par WP grâce à wp_localize_script()
	if( typeof ajaxurl != 'string'){
		var ajaxUrl = '/wp-admin/admin-ajax.php';
	}else{
		var ajaxUrl = ajaxurl;
	}


	// ================================
	// get total post of story
	// ================================
	function getMetaboxs(){
		// retourne le nombre d'elements disponibles dans la page
		n__metabox = jQuery('.story-container').length;
	}
	function getElements(){
		// retourne le nombre d'elements disponibles dans la page
		n__element = jQuery('.story__element').length;
	}

	// ================================
	// requete template
	// ================================


	function getTemplate( type, folder, file, structure ){

		structure.replace(/ /g,'');
		var structureArray = structure.split(',');
		var contentLength = structureArray.length;


		var data = {
			'action': 'Storytelling__getNewBox',
			'type': type,
			'folder': folder,
			'file' : file,
			'n__metabox': n__metabox
		};

	    $.post( ajaxurl, data, function(response) {

	    	$( '#post-body-content' ).append( response );

	    	window.setTimeout(function() {


				if( n__element === 0 )$('.story-container').first().addClass('story-first');

	    		// pour chaque structure de type content, on init un tinymce
	    		for (index = 0; index < contentLength; ++index) {


	    			var new__editor = "story__editor__" + parseInt( parseInt( n__metabox * 1000 ) + parseInt( index + 1 ) );

					if( $.trim(structureArray[ index ]) === "editor" ){

			    		// on test si l'editeur a déja été instancié
			    		instance = false;
			    		$.each( tinymce.editors, function(e){

			    			if( this.id === new__editor ){
			    				// deja instancié 
			    				instance = true;
			    			}
			    		});

			    		if( instance === true ){
			    			tinymce.EditorManager.execCommand('mceAddEditor',true, new__editor);
			    		}else{		    			
							tinyMCEPreInit.mceInit[ 'content' ].selector = '#' + new__editor;
							tinyMCEPreInit.qtInit[ 'content' ].id = new__editor;
							tinymce.init(tinyMCEPreInit.mceInit[ 'content' ]);
							quicktags( tinyMCEPreInit.qtInit[ 'content' ] );
			    		}
			    		instance = false;


					}

					
				}


	    	},100);

			n__metabox++;

	    });

	}

	// ================================
	// Choix du dossier
	// ================================
	$(document).on('change','#storytelling__folder__selector', function(e){

		$('#story__selector .inside ol').hide();
		$('#story__selector .inside ol#' + $(this).val()).show();

	});


	// ================================
	// instanciate image uploader
	// ================================
	var selectedButton, imageRemover;

	$(document).on('click','.story__element__image .upload_image_button', function(e) {
 
        e.preventDefault();
 
 		selectedButton = $(this);
 		imageRemover = $(this).closest('.story__element').find('.story__imageRemover');


        //If the uploader object has already been created, reopen the dialog
        if ( file_frame ) {
	      file_frame.open();
	      return;
	    }
 
	    // Create the media frame.
	    file_frame = wp.media.frames.file_frame = wp.media({
	      title: jQuery( this ).data( 'upload_image' ),
	      button: {
	        text: jQuery( this ).data( 'upload_image_button' ),
	      },
	      multiple: false  // Set to true to allow multiple files to be selected
	    });


	    // When an image is selected, run a callback.
	    file_frame.on( 'select', function() {

			// We set multiple to false so only get one image from the uploader
			attachment = file_frame.state().get('selection').first().toJSON();

			$('<img>', {
			    src: attachment.sizes.medium.url
			}).insertBefore( selectedButton );

			selectedButton.hide();
			imageRemover.show();

			selectedButton.closest('.story__element')
			.find('.story__image__id').attr('value', attachment.id );


	    });

	    // Finally, open the modal
	    file_frame.open();
 
    });


	// ================================
	// Remove story Element
	// ================================
	// delete
	$(document).on('click','.story__remove__element .remover a', function(e) {
		e.preventDefault();
		$(this).closest('.story__remove__element').find('.confirm').show();
		$(this).hide();
	});
	// confirm
	$(document).on('click','.story__remove__element .confirm .delete', function(e) {
		e.preventDefault();

		var buttonRemove = $(this);
		var elements = buttonRemove.closest('.story__remove__element').data('elements')

		var data = {
			'action': 'Storytelling__deleteElements',
			'elements': encodeURIComponent(elements),
			'parent': jQuery('#post_ID').val()
		};

		if( elements != '' ){

			$.post('/wp-admin/admin-ajax.php', data, function(response) {


					buttonRemove.closest('.story-container').remove();
					// on supprimer aussi tout les editeurs tiny mce
					$.each( buttonRemove.closest('.story-container').find('input[name="story__post__[]"]'), function(e){

						tinymce.EditorManager.execCommand('mceRemoveEditor',true, $(this).val() );
			
					});

					getElements();

			});

		}else{
			buttonRemove.closest('.story-container').remove();
		}


	});
	// cancel
	$(document).on('click','.story__remove__element .confirm .cancel', function(e) {
		e.preventDefault();
		$(this).closest('.story__remove__element').find('.confirm').hide();
		$(this).closest('.story__remove__element').find('.remover a').show();
	});


	// ================================
	// instanciate image remover
	// ================================

	$(document).on('click','.story__imageRemover', function(e) {

		e.preventDefault();

		$(this).closest('.story__element').find('img').remove();
		$(this).closest('.story__element').find('.upload_image_button').show();
		$(this).closest('.story__element').find('.story__image__id').attr('value','');
		$(this).hide();

	});

	// ================================
	// selector click
	// ================================

	$(document).on('click', '#story__selector a', function( e ){

		e.preventDefault();

		var type = $(this).data('type');
		var folder = $(this).data('folder');
		var file = $(this).data('file');
		var structure = $(this).data('structure');

		getTemplate( type, folder, file, structure );

		return false;

	});


	$(document).on('click', '.postbox .handlediv.story', function(){

		var postbox = $(this).closest('.postbox');
		
		if( postbox.hasClass('closed') )
		{
			postbox.removeClass('closed');
		}
		else
		{
			postbox.addClass('closed');
		}
		
	});


	// fix iframe height
	$(document).on('click', '.postbox-container .postbox .handlediv', function(){

		var postbox = $(this).closest('.postbox');
		
		if( !postbox.hasClass('closed') )
		{
			jQuery.each( tinyMCE.editors , function(i,e){
				$newHeight = jQuery(e.contentDocument.activeElement).outerHeight()
				tinyMCE.editors[i].theme.resizeTo('100%', $newHeight);
			});
		}

	});
   
    jQuery(window).load(function($){
		getMetaboxs();
		getElements();
    });

})(jQuery, ajaxurl);