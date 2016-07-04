// Modifique o valor para mostrar ou não logs na tela
var DEBUG = true;


if (DEBUG) {

	var sn_log = console.log.bind(window.console);
	var sn_error = console.error.bind(window.console);

} else {
	
	var sn_log = function() {};
	var sn_error = function() {};

}

$(document).ready(function() {

	componentHandler.registerUpgradedCallback("MaterialLayout", function(elem) {
		
		sn_base.doInit();
		sn_parallax_background.doInit();
		sn_toast.doInit();
		sn_inputmask.doInit();
			
	});

});


jQuery.fn.exists = function() { return this.length > 0; }


var tryExecute = function(func, prefix, successMessage, errorMessage) {
	
	try {
	    
	    var res = func();
	    sn_log(prefix + " - " + successMessage);
	    return res;

	} catch(err) {

		sn_error(prefix + " - " + errorMessage + " [" + err + "]");
		return null;

	}
	
}

var sn_base = function() {

	var dialogCounter = 0;

	var setupForm = function(root) {

		root = root == undefined? "body": root;

		if($(root + " .sn-date-picker").exists()) { 

			$(root + " .sn-date-picker").each(function(index, el) {
				el = $(el);
				var id = el.attr("id");
				if (id == undefined) {
					el.attr("id", "sn-date-picker-" + index);
				}
				var selector = "#" + id;
				sn_base.doRegistryDatePicker(selector, $(root));
			});

		}

		if($(root + " .sn-time-picker").exists()) { 

			$(root + " .sn-time-picker").each(function(index, el) {
				el = $(el);
				var id = el.attr("id");
				if (id == undefined) {
					el.attr("id", "sn-time-picker-" + index);
				}
				var selector = "#" + id;
				sn_base.doRegistryTimePicker(selector, $(root));
			});

		}

		if($(root + " .sn-date-time-picker").exists()) { 

			$(root + " .sn-date-time-picker").each(function(index, el) {
				el = $(el);
				var id = el.attr("id");
				if (id == undefined) {
					el.attr("id", "sn-date-time-picker-" + index);
				}
				var selector = "#" + id;
				sn_base.doRegistryDateTimePicker(selector, $(root));
			});

		}
		
	}
	
	var setupScrollEvents = function() {

		$(".mdl-layout__content").scroll(function() {

			scrollTop = $(this).scrollTop();
			if(scrollTop > 8)
				$(".mdl-layout__header").css("box-shadow", "0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)");
			else 
				$(".mdl-layout__header").css("box-shadow", "none");				

		});
		$(".mdl-layout__header").css("box-shadow", "none");

		$(".mdl-layout__content").scroll(function() {

			$(".sn-rear-track").css("top", "-" + ($(this).scrollTop()*0.5) + "px");

		});

	}

	var setupDialog = function(dialogSelector) {

		
	}

	var setupDrawer = function() {

		var hb = $($.parseHTML(
			"<button class=\"sn-btn-hanburger sn-btn-hanburger-hidden mdl-js-ripple-effect\">" + 
				  "<i class=\"material-icons\">menu</i>" + 
				  "<span class=\"mdl-ripple\"></span>" + 
			"</button>"
		));

		var hbHidden = $($.parseHTML(
			"<button class=\"sn-btn-hanburger sn-btn-hanburger-inverse mdl-js-ripple-effect\">" + 
				  "<i class=\"material-icons\">menu</i>" + 
				  "<span class=\"mdl-ripple\"></span>" + 
			"</button>"
		));

		hb.click(function() {

			toggleDrawer();

		});

		hbHidden.click(function() {

			toggleDrawer();

		});

		$(".mdl-layout__header").prepend(hb);
		$(".sn-drawer-left").prepend(hbHidden);

		$(".sn-main__foreground").click(toggleDrawer);

	}

	var toggleDrawer = function() {

		$("*").removeClass("sn-no-animation");	    

		var drawer = $(".sn-drawer-left");
		drawer.toggleClass("sn-drawer-left-closed");

		var main = $(".sn-main");
		main.toggleClass("sn-main-expanded");

		$(".sn-btn-hanburger").toggleClass("sn-btn-hanburger-hidden");

		$(".sn-main__foreground").toggleClass("sn-main__foreground-hidden");

	}

	var showContent = function() {

		$(".sn-foreground").fadeOut(500);

	}

	var sortDivs = function() {

		var items = $("body").children();

		items.sort(function (a, b) {
			var contentA = $(a).hasClass("dtp")? 3: $(a).hasClass("mdl-dialog")? 2: 1;
			var contentB = $(b).hasClass("dtp")? 3: $(b).hasClass("mdl-dialog")? 2: 1;
			return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
	   	});

	   	items.each(function(i, el) {
	   		$(el).parent().append(el);
	   	});
	}
	
	var setupFab = function() {
		$(".sn-float--launcher").click(function() {
			$(".sn-float--launcher").parent().find(".sn-fab").toggleClass("sn-fab--hide");
		});
	}
	
	var setupSnackBar = function() {

		var sb = $.parseHTML("" + 
			"<div id=\"sn-snackbar\" class=\"mdl-js-snackbar mdl-snackbar\">" + 
				"<div class=\"mdl-snackbar__text\"></div>" + 
				"<button class=\"mdl-snackbar__action\" type=\"button\"></button>" + 
				"<div class=\"mdl-snackbar__icon\"><i class=\"material-icons\">add</i></div>" + 
			"</div>"
		);

		$("body").append(sb);

		componentHandler.upgradeElement(sb[0]);

		setTimeout(
			function() {

				$(".sn-messages").children().each(function(_, el) { 
					var text = $(el).text();
					var type = $(el).data("tipo");

					sb[0].MaterialSnackbar.showSnackbar({
						message: text + "<i>teste</i>"
					});
				});	

			}, 
			1000
		);
		
	}

	var setupTheme = function() {

		var classList = $("body").attr("class");
		var reg = /sn-theme-\w+-*\w*/;
		var reg2 = /sn-theme-/;
		if(reg.test(classList)) {
			
			var theme = classList.match(reg)[0].replace(reg2, "");
			$(".mdl-button, .mdl-layout-title, .mdl-layout__header, .dtp-date, .dtp-header, .dtp .selected").not(".sn-fab").each(function() {
				$(this)[0].className = $(this)[0].className.replace(/mdl-color-*(\w|\d)*-*(\w|\d)*-*(\w|\d)*/, '');	

				if($(this).hasClass("mdl-button--raised")) {
					$(this).addClass("mdl-color--" + theme);
					$(this).addClass("mdl-color-text--white");
				} else if($(this).hasClass("mdl-button")) {
					$(this).addClass("mdl-color-text--" + theme + "-600");
				} 

				if($(this).hasClass("mdl-layout__header") ||
					$(this).hasClass("selected") ||
					$(this).hasClass("dtp-date")) {
					$(this).addClass("mdl-color--" + theme);
				}

				if($(this).hasClass("dtp-header")) {
					$(this).addClass("mdl-color--" + theme + "-700");
				}

				if($(this).hasClass("mdl-layout-title") && !$(this).parent().hasClass("mdl-layout__header-row")) {
					$(this).addClass("mdl-color-text--" + theme + "-600");
					$(this).parent().addClass("mdl-color--white");
				}

			});

		}

		sn_log($(".selected").length);

	}

	var setupBreadCrumbs = function() {

		var breadIconTemplate = $($.parseHTML("<i class=\"sn-breadcrumbs__icon material-icons\">keyboard_arrow_right</i>"));

		$(".sn-breadcrumbs").each(function(index, _) {
			if(index < $(".sn-breadcrumbs").length - 1) {
				console.log(breadIconTemplate);
				$(breadIconTemplate.clone()).insertAfter($(this));
			}
		});

	}

	return {

		doInit : function() {

			tryExecute(setupForm, "sn_base", "Setup form done!", "Setup form error!");
			tryExecute(setupScrollEvents, "sn_base", "Setup scroll events done!", "Setup scroll events error!");
			tryExecute(setupDrawer, "sn_base", "Setup drawer done!", "Setup drawer error!");
			tryExecute(setupFab, "sn_base", "Setup Fab done!", "Setup Fab error!");	
			tryExecute(setupSnackBar, "sn_base", "Setup SnackBar done!", "Setup SnackBar error!");	
			tryExecute(setupTheme, "sn_base", "Setup Theme done!", "Setup Theme error!");	
			tryExecute(setupBreadCrumbs, "sn_base", "Setup BreadCrumbs done!", "Setup BreadCrumbs error!");	

			tryExecute(toggleDrawer, "sn_base", "Toggle drawer done!", "Toggle drawer error!");
			tryExecute(showContent, "sn_base", "Show content done!", "Show content error!");	

		}, 

		doRegistryDialog : function(setts) {

			var dialogText="" + 
				"<dialog class=\"mdl-dialog\" id=\"modal-1\">" + 

					"<div class=\"mdl-card__menu\">" + 
						"<button class=\"mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect mdl-card__menu-close\">" + 
							"<i class=\"material-icons\">close</i>" + 
						"</button>" + 
					"</div>" + 

					"<h4 class=\"mdl-dialog__title\"></h4>" + 
					"<div class=\"mdl-dialog__content\">" + 
						// ...
					"</div>" + 
					"<div class=\"mdl-dialog__actions\">" + 
						// ...
					"</div>" +

				"</dialog>";

			var dialog = $($.parseHTML(dialogText));
			var dialogContent = $(setts.dialog);
			dialogContent.remove();

			dialog.attr("id", "sn-dialog-" + (dialogCounter++));
			
			$("body").append(dialog);	
			
			dialog.find(".mdl-dialog__content").append(dialogContent);
			dialog.find(".mdl-card__menu-close").click(function() { dialog.get(0).close(); });
			dialog.find(".mdl-dialog__title").text(setts.title);

			if(setts.buttons !== undefined)
				for(var i = 0; i < setts.buttons.length; i++) {
					
					var index = parseInt(JSON.stringify(i));
					//var bs = setts.buttons[i];
					var bs = setts.buttons[index];
					var button = $.parseHTML("<a class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary\">" + bs.label + "</a>");
					//$(button).click(bs.action);
					$(button).click(bs.action);
					dialog.find(".mdl-dialog__actions").append(button);
					for(k in bs.attrs)
						$(button).attr(k, bs.attrs[k]);		

				}

			if (!dialog.get(0).showModal) {
				dialogPolyfill.registerDialog(dialog.get(0));
			}

			$(setts.showButton).click(function() {
				dialog.get(0).showModal();
			});

			dialog.find("*").each(function(i, el) {
				componentHandler.upgradeElement(el);
			});

			setupForm("#" + dialog.attr("id"));

			sortDivs();

			tryExecute(setupTheme, "sn_base", "Setup Theme done!", "Setup Theme error!");	

			return dialog.get(0);

		}, 

		doRegistryDatePicker : function(el, root) {

			if(root === undefined) root = $("body");
			if($(el).exists()) {

				$(el).bootstrapMaterialDatePicker({
					format: "DD/MM/YYYY", 
					shortTime: false, 
					date: true, 
					time: false, 
					currentDate: new Date(), 
					nowButton: true, 
					cancelText: "Cancelar", 
					okText: "OK", 
					nowText: "Agora", 
					parent: root
				});

			}

			sortDivs();

			tryExecute(setupTheme, "sn_base", "Setup Theme done!", "Setup Theme error!");	

		}, 

		doRegistryTimePicker : function(el, root) {

			if(root === undefined) root = $("body");
			if($(el).exists()) {

				$(el).bootstrapMaterialDatePicker({
					format: "HH:mm", 
					shortTime: false, 
					date: false, 
					time: true, 
					currentDate: new Date(), 
					nowButton: true, 
					cancelText: "Cancelar", 
					okText: "OK", 
					nowText: "Agora", 
					parent: root
				});

			}

			sortDivs();

			tryExecute(setupTheme, "sn_base", "Setup Theme done!", "Setup Theme error!");	

		}, 

		doRegistryDateTimePicker : function(el, root) {

			if(root === undefined) root = $("body");
			if($(el).exists()) {

				$(el).bootstrapMaterialDatePicker({
					format: "DD/MM/YYYY HH:mm", 
					shortTime: false, 
					date: true, 
					time: true, 
					currentDate: new Date(), 
					nowButton: true, 
					cancelText: "Cancelar", 
					okText: "OK", 
					nowText: "Agora", 
					parent: root
				});

			}

			sortDivs();

			tryExecute(setupTheme, "sn_base", "Setup Theme done!", "Setup Theme error!");	

		}

	};

} ();