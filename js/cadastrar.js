$(document).ready(function() {

	componentHandler.registerUpgradedCallback("MaterialLayout", function(elem) {
		
		var dialog = null;

		var dynamicList = $(".sn-list-exames").dynamicList({
			cloneableElement: ".sn-cloneable", 
			removeButton: ".sn-exame-remove", 
			editButton: ".sn-exame-edit", 
			onItemEdit: function(el, index) {

				if(dialog != null) {
					var type = el.find(".sn-exame-type").text();
					var val = el.find(".sn-exame-value").text();

					$(dialog).find("#sn-exame-type").val(type);
					$(dialog).find("#sn-exame-value").val(val);
					$(dialog).find("#sn-exame-item-index").val(index);

					dialog.showModal();
				}
				
			}, 
			onItemRemove: function(item) {
				el = item;
				
				el.css("min-height", "0px");
				el.css("min-width", "0px");
				
				var anim = new Animation(el).doSequentially(
					new Animation().doAnimate(
						{"border-radius": "50px", specialEasing: {"border-radius": "linear"}},
						{duration: 100, queue: false}
					),
					new Animation().doAnimate(
						{width: "72px", height: "72px", specialEasing: {width: "linear"}},
						{duration: 100, queue: false}
					),
					new Animation().doAnimate(
						{width: "0px", height: "0px", specialEasing: {width: "linear"}},
						{duration: 50, queue: false}
					)
					
				).doPlay();

				setTimeout(function() {
					dynamicList.doRemoveItem(item);
				}, 250);				
				
			}
		});

		dialog = sn_base.doRegistryDialog({
			title: "Adicionar Exame", 
			dialog: "#sn-add-exame-modal", 
			showButton: "#sn-add-exame-button", 
			buttons: [
				{
					label: "OK",
					attrs: {id: "btn-ok", type: "submit"}, 
					action: function() {
						dialog.close();

						var index = $(dialog).find("#sn-exame-item-index").val();
						var type = $(dialog).find("#sn-exame-type").val();
						var val = $(dialog).find("#sn-exame-value").val();
						var data = {
							sortValue: val,  
							".sn-exame-type": {text: type},
							".sn-exame-value": {text: val} 
						};
						
						var el;

						if(index != "") {
							el = dynamicList.doEditItem(index, data);
						}
						else {
							el = dynamicList.doAddItem(data);

							el.css("min-height", "0");
							el.css("min-width", "0");
							el.css("border-radius", "50px");
							el.css("width", "72px");
							var anim = new Animation(el).doSequentially(
								new Animation().doAnimate(
									{"width": "100%", specialEasing: {width: "linear"}},
									{duration: 200, queue: false}
								), 
								new Animation().doAnimate(
									{"border-radius": "2px", specialEasing: {"border-radius": "linear"}},
									{duration: 50, queue: false}
								)
							).doPlay();
						}

						$(dialog).find("#sn-exame-item-index").val("");

						componentHandler.upgradeDom();						

					}
				}
			]

		});
			
	});

});