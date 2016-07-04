var sn_toast = function() {

	var templateRoot = "" + 
		"<div class=\"sn-toast\">" + 
		"";

	var tamplateToast = "" + 
		"<div class=\"sn-toast__message\">" + 
			"<div class=\"sn-toast__text\"></div>" + 
			"<i class=\"sn-toast__icon material-icons\">face</i>" + 
			"<div class=\"sn-toast__loading\"></div>" + 
		"</div>" + 
		"";

	var toastSelector = ".sn-toast";
	var toastTextSelector = ".sn-toast__text";

	var createToast = function(message, type, showProgress) {
		
		var toast = $($.parseHTML(tamplateToast));
		toast.find(toastTextSelector).text(message);

		var color = "";
		var colorLoading = "";
		var icon = "";

		if(type === "informacao") {
			color = "mdl-color-text--blue-600";
			colorLoading = "mdl-color--blue-300";
			icon = "info";
		} else if(type === "sucesso") {
			color = "mdl-color-text--green-600";
			colorLoading = "mdl-color--green-300";
			icon = "done";
		} else if(type === "aviso") {
			color = "mdl-color-text--orange-600";
			colorLoading = "mdl-color--orange-300";
			icon = "warning";
		} else if(type === "erro") {
			color = "mdl-color-text--red-600";
			colorLoading = "mdl-color--red-300";
			icon = "error";
		} else {
			color = "mdl-color-text--grey-600";
			colorLoading = "mdl-color--teal-300";
			icon = "clear";
		}

		toast.find("*").addClass(color);
		if (showProgress) toast.find(".sn-toast__loading").addClass(colorLoading);
		toast.find(".sn-toast__icon").text(icon);

		toast.find(".sn-toast__icon").hover(function() {
			toast.find(".sn-toast__icon").text("clear");
		});
		toast.find(".sn-toast__icon").mouseout(function() {
			toast.find(".sn-toast__icon").text(icon);
		});
		toast.find(".sn-toast__icon").click(function() {
			removeToast(toast);
		});

		return toast;

	}

	var showToast = function(toast, delay, postDelay) {
		var height = toast.height();
		toast.height("0");
		toast.css("margin-top", "0");
		toast.css("margin-bottom", "0");
		toast.css("opacity", "0");

		var anim = new Animation(toast).doSequentially(
			new Animation().doAnimate(
				{"height": "0px", specialEasing: {height: "linear"}},
				{duration: delay, queue: false}
			), 
			new Animation().doAnimate(
				{"height": height + "px", "margin-top": "8px", "margin-bottom": "8px", opacity: 1.0, specialEasing: {height: "linear"}},
				{duration: 200, queue: false}
			)
		).doPlay();

		var anim = new Animation($(".sn-toast__loading")).doSequentially(
			new Animation().doAnimate(
				{"right": "0%", specialEasing: {height: "linear"}},
				{duration: delay + postDelay + 200}
			)
		).doPlay();

		setTimeout(function() {

			removeToast(toast);

		}, postDelay + delay + 200);

	}

	var removeToast = function(toast) {

		var anim = new Animation(toast).doSequentially(
			new Animation().doAnimate(
				{opacity: 0.0, specialEasing: {height: "linear"}},
				{duration: 300, queue: false}
			), 
			new Animation().doAnimate(
				{"height": "0px", "margin-top": "0px", "margin-bottom": "0px", specialEasing: {height: "linear"}},
				{duration: 300, queue: false}
			)
		).doPlay();

		setTimeout(function() {
			toast.remove();
		}, 700);

	}

	return {

		doInit : function() {

			var toasts = $(toastSelector);
			toasts.remove();
			
			var container = $($.parseHTML(templateRoot));
			$("body").append(container);

			var delay = 500;

			toasts.each(function() {
				var el = $(this);

				postDelay = el.data("duration") !== undefined? el.data("duration"): 5000;
				toast = createToast(el.text(), el.data("type"), el.data("showprogress"))

				container.append(toast);

				showToast(toast, delay, postDelay);
				delay += 500;

			});
			
		}, 

		doShowToast : function(setts) {

			var settings = {
				text: "", 
				type: "", 
				duration: 5000, 
				showProgress: true
			};

			for(k in setts)
				settings[k] = setts[k];

			var container = $(".sn-toast");

			var delay = 100;
			var postDelay = settings.duration;

			toast = createToast(settings.text, settings.type, settings.showProgress)

			container.append(toast);

			showToast(toast, delay, postDelay);

		}

	};

} ();