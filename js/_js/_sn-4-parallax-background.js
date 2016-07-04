var sn_parallax_background = function() {

	// Guarda o último valor da cor de background
	// Necessário porque alguns navegadores substituem o rgba(0, 0, 0, 0) por transparent
	var lastRGBA = "rgba(0, 0, 0, 0)";

	// Altura da imagem de background
	var headerImageHeight = 0.0;

	// Função que calcula a altura da imagem de background
	var headerHeightFunction = function () {

		// A altura da imagem é calculada com base na largura, estabelecendo
		// um aspecto de 16:9
		headerImageHeight = $(window).width() * 9.0 / 16.0 * 0.6;

	}

	// Função que deixa o header transparente ou não com base na rolagem da página
	var scrollFunction = function () {
		
	    var scroll = $(".mdl-layout__content").scrollTop();

	    $("*").addClass("sn-no-animation");
	    $(".sn-header-image__background").css('background-position', '0px ' + (-scroll * 0.5) + "px");

	    var opacity = scroll > headerImageHeight * 0.5?
	    	((scroll - headerImageHeight*0.8) / (headerImageHeight * 0.2)):
	    	0;

	    if(opacity > 1) 
	    	opacity = 1;

	    var rawRgb = $(".mdl-layout__header").css("background-color");

	    if(rawRgb == "transparent")
	    	rawRgb = lastRGBA;

	    rgb = rawRgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	    if(rgb == null) {

	    	rgb = rawRgb.substring(rawRgb.indexOf('(') + 1, rawRgb.lastIndexOf(')')).split(/,\s*/);
	    	var rgba = "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + opacity + ")";
	    	$(".mdl-layout__header").css("backgroundColor", rgba);
	    	lastRGBA = rgba;

	    } else {

	    	var rgba = "rgba(" + rgb[1] + ", " + rgb[2] + ", " + rgb[3] + ", " + opacity + ")";
	    	$(".mdl-layout__header").css("backgroundColor", rgba);
	    	lastRGBA = rgba;

	    }

	    if(opacity < 1)
	    	$(".mdl-layout__header").css("box-shadow", "none");
	    else
			$(".mdl-layout__header").css({ boxShadow : "0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)" });

	    if($(".sn-header__fab").exists()) {
	    	if(opacity >= 1) {
	    		$(".sn-header__fab").fadeIn();
	    	} else {
	    		$(".sn-header__fab").fadeOut();
	    	}
	    }

	};


	return {

		doInit : function() {

			if($(".sn-parallax-background").exists()) {

				headerHeightFunction();
				scrollFunction();

				// Iniciando stellar, plugin para paralaxe na imagem de fundo
				$(".mdl-layout__content").scroll(scrollFunction);

				// Setando altura apropriada para o frame de referencia 
				$(".sn-header-image__frame").height( headerImageHeight );
				$(window).resize(function() {
					headerHeightFunction();
					scrollFunction();
					$(".sn-header-image__frame").height( headerImageHeight );
				});

				$(".mdl-layout__content").animate({
			        scrollTop: headerImageHeight * 0.8
			    }, 800);

			}

		}

	};

} ();