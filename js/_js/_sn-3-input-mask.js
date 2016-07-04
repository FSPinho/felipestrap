var sn_inputmask = function() {

	var inputTipTemplate = "" +
		"<div class=\"sn-input-tip\"> Tip </div>"
	"";

	var createTip = function() {
		var tip = $($.parseHTML(inputTipTemplate));
		tip.hide();
		return tip;
	}

	var showTip = function(tip, text) {
		
		if(!tip.data("active")) {
			
			tip.data("active", true);
			tip.text(text);
			tip.fadeIn("fast");

			setTimeout(function() {
				tip.data("active", false);
				tip.fadeOut("fast");
			}, 3000);
		}

	}

	var addUnit = function(el) {
		//if(el.data("unit")) {
		//	el.val( el.val() + " " + el.data("unit") );
		//}
	}

	var removeUnit = function(el) {
		//el.val( el.val().replace(" " + el.data("unit"), "") );
	}

	return {

		doInit : function() {

			$("input[type=text]").each(function(_, e) {

				var el = $(e);
				var tip = createTip();
				el.parent().append(tip);
				el.on("change paste keyup", function() {
					var input = $(this);

					if(input.data("max-length")) {
						var reg1 = new RegExp("^.{0," + input.data("max-length") + "}$");
						var reg2 = new RegExp("^.{0," + input.data("max-length") + "}");

						if(!reg1.test(input.val())) {
							input.val( input.val().match(reg2)[0] );
							showTip(tip, input.data("max-length-tip"));
						}
					}
				});

			});

			$("input[type=email]").each(function(_, e) {

				var el = $(e);
				var tip = createTip();
				el.parent().append(tip);
				el.on("change paste keyup", function() {
					var input = $(this);

					var reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

					if(!reg.test(input.val())) {
						input.addClass("sn-textfield__input-error");
						showTip(tip, input.data("type-tip"));
					} else {
						input.removeClass("sn-textfield__input-error");
					}
				});

			});

			$("input[type=integer], input[type=decimal]").each(function(_, e) {

				var regInteger1 = /^\-?(\d+)?$/
				var regInteger2 = /^\-?(\d+)?/

				var regDecimal1 = /^\-?(\d+)?\.?(\d{1,2})?$/
				var regDecimal2 = /^\-?(\d+)?\.?(\d{1,2})?/
				var regDecimal3 = /^\-?(\d+)?\.$/
				var regDecimal4 = /^\-?\.(\d{1,2})?$/

				var el = $(e);
				var tip = createTip();
				el.parent().append(tip);

				if(el.val() === "")
					if(el.attr("type") === "integer") 					
						el.val("0");
					if(el.attr("type") === "decimal") 					
						el.val("0.00");
				addUnit(el);

				el.on("change paste keyup", function() {
					var input = $(this);

					if(input.attr("type") === "integer") {
						
						if(!regInteger1.test(input.val())) {
							var match = input.val().match(regInteger2);
							match = match == null? []: match;
							input.val( match.length > 0? match[0]: "" );
						}

					} else if(input.attr("type") === "decimal") {
						if(!regDecimal1.test(input.val())) {
							var match = input.val().match(regDecimal2);
							match = match == null? []: match;
							input.val( match.length > 0? match[0]: "" );
						}

					}

					var val = parseFloat(input.val());

					if(input.data("max") !== undefined) {
						var max = parseFloat(input.data("max"));
						if(val > max) {
							input.val("" + max);
							showTip(tip, input.data("max-tip"));
						}
					}
					if(input.data("min") !== undefined) {
						var min = parseFloat(input.data("min"));						
						if(val < min) {
							input.val("" + min);
							showTip(tip, input.data("min-tip"));
						}
					}
					
				});

				el.focusin(function() {
					removeUnit($(this));
				});

				el.focusout(function() {
					var input = $(this);
					if(input.val() == "." || input.val() == "" || input.val() == "-")
						input.val("0");
					if(input.attr("type") === "integer") 					
						input.val( parseInt(input.val()) );
					if(input.attr("type") === "decimal") 					
						input.val( parseFloat(input.val()).toFixed(2) );

					addUnit(input);
				});

			});
			
		}

	};

} ();