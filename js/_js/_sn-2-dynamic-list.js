// Método atribuído ao namespace do JQuery para criação de DynamicList's
jQuery.fn.dynamicList = function(settings) {

	// Criação de um novo objeto do tipo DynamicList
	return new DynamicList($(this), settings).doInit();

}

// Método atribuído ao namespace do JQuery para verificar se o objeto já contém 
// a atribuição de uma DynamicList
jQuery.fn.isDynamicList = function(settings) {

	return $(this).data("dynamic-list-settings") !== undefined;

}


// Classe responsável por guardar métodos e atributos do componente DynamicList

var DynamicList = function(rootEl, settings) {

	// Configurações da lista dinâmica

	this.DEFAULT_SETTINGS = {

		// Seletor do elemento que será clonado
		cloneableElement: ".dl-el", 

		// Seletor do botão responsável por adicionar novos items
		addButton: ".dl-add", 
		// Seletor do botão responsável por remover items
		removeButton: ".dl-el-remove", 
		// Seletor do botão responsável por editar items
		editButton: ".dl-el-edit", 
		// Seletor do botão responsável por clonar items
		cloneButton: ".dl-el-clone", 

		// Indica se os atributos terão o id incrementado automaticamente.
		// Nesse caso, um id "elemento-0" sera incrementado para "elemento-1" e
		// assim por diante
		autoIncrementID: true, 
		autoIncrementName: true, 

		// Indica se o primeiro elemento da lista será mostrado ou não
		hideFirst: true,
		// Indica a forma de display padrão para cada elemento da lista
		defaultItemDisplay: "block",

		// Trás os valores padrão para os elementos da lista
		defaultData: {}, 

		// Lista de callbacks
		// Para que o item seja adicionado, removido ou editado, retorne true
		onItemAdd: function(item) { return true; }, 
		onItemAdded: function(item) {}, 
		onItemRemove: function(item) { return true; }, 
		onItemRemoved: function(item) {}, 
		onItemEdit: function(item) { return true; },
		onItemEdited: function(item) {},
		onItemClone: function(item) { return true; },
		onItemCloned: function(item) {},
		
	};

	this.rootEl = rootEl;
	this.parent = undefined;
	this.settings = settings;
	this.template = undefined;

	this.error = function(message) {

		console.error("Dynamic HTML: " + message);

	}

	this.log = function(message) {

		console.log("Dynamic HTML: " + message);

	}

	this.showStatus = function(message) {

		// console.log(this.parent.attr("id") + " - " + message + " - Elements: " + parent.children(this.settings.cloneableElement).length);

	}

	this.getNextAttrBy = function(attr) {

		var attrs = attr.split("-");
		var index = attrs[attrs.length - 1];

		if($.isNumeric(index)) {

			var index = parseInt(index) + 1;
			var newAttr = "" + index;
			for(var i = attrs.length - 2; i >= 0; i--)
				newAttr = attrs[i] + "-" + newAttr;

			return newAttr;

		}

		return attr;

	}

	this.doIncrementItem = function(name, index) {
		
		if( /[\w]+\[[\d]+\]\.[\w]+/.test(name) ) {
			return name.replace( /\[[\d]+\]+/, "[" + index + "]")
		} 

		return name;

	}

	this.sortItems = function() {
		var items = $(this.settings.cloneableElement);
		items.sort(function (a, b) {
			var contentA = parseInt( $(a).data('sort'));
			var contentB = parseInt( $(b).data('sort'));
			return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
	   	});

	   	var self = this;
	   	items.each(function(i, e) {
	   		var index = parseInt(JSON.stringify(i));

	   		$(e).data("index", index);
	   		$(e).parent().append(e);

			var setSetupFunc = function(rootEl) {

				rootEl.children().each(function(_, elm) {
					
					var el = $(elm);

					if(!el.isDynamicList()) {

						el.attr("name", self.doIncrementItem(el.attr("name"), index));
						setSetupFunc(el);

					}

				});

			}

			$(e).attr("name", self.doIncrementItem($(e).attr("name"), index));
			setSetupFunc($(e));

	   	});
	}

	/* PUBLIC */

	this.doInit = function() {

		DynamicList.objectCount++;

		var self = this;

		if(self.rootEl.length == 0) 
			self.error("O elemento especificado como container não existe!");

		if(self.settings === undefined)
			self.settings = this.DEFAULT_SETTINGS;

		else
			for(k in self.DEFAULT_SETTINGS)
				if(self.settings[k] === undefined)
					self.settings[k] = self.DEFAULT_SETTINGS[k];


		self.rootEl.data("dynamic-list-id", DynamicList.objectCount);
		self.rootEl.data("dynamic-list-settings", self.getSettings());

		self.parent = $(self.rootEl.find(self.settings.cloneableElement).get(0)).parent();
		var items = self.parent.children(self.settings.cloneableElement);
		
		if(items.length == 0) {

			self.error("Você precisa de pelo menos um item para clonar!");

		} else {

			var item = $(items.get(0));	
			item.remove();
			self.template = item;
			self.settings.defaultItemDisplay = item.css("display");

			if(self.settings.hideFirst) {

				item.css("display", "none");

			} else {
				
				var setRemoveFunc = function(rootEl) {

					rootEl.children(self.settings.removeButton).each(function(index, el) {
						
						if(!$(el).isDynamicList()) {

							$(el).click(function() {

								if(self.settings.onItemRemove(rootEl))
									self.doRemoveItem(rootEl);
								
							});

							setRemoveFunc($(el));

						}

					});

				}

				setRemoveFunc(item);

				var setCloneFunc = function(rootEl) {

					rootEl.children(self.settings.cloneButton).each(function(index, el) {
						
						if(!$(el).isDynamicList()) {

							$(el).click(function() {

								if(self.settings.onItemClone(rootEl))
									self.doCloneItem(rootEl);
								
							});

							setCloneFunc($(el));

						}

					});

				}

				setCloneFunc(item);

			}

		}

		var setAddFunc = function(rootEl) {

			rootEl.children(self.settings.addButton).each(function(index, el) {
				
				$(el).click(function() {

					var data = self.settings.onItemAdd();
					if(data != undefined && data !== false)
						self.doAddItem(data);
					
				});

			});

			rootEl.children().each(function(index, el) {
				if(!$(el).isDynamicList()) {
					setAddFunc($(el));
				}
			});

		}

		setAddFunc(self.rootEl);

		//***
		items.each(function(_, e) {

			var toRemove = undefined;

			if($(e).attr("id") == undefined) {
				DynamicList.objectCount++;
				$(e).attr("id", "sn-cloneableElement-" + DynamicList.objectCount);
				toRemove = $("#sn-cloneableElement-" + DynamicList.objectCount);
			} else {
				toRemove = $("#" + $(e).attr("id"));
			}

			var setRemoveFunc = function(rootEl) {

				rootEl.children(self.settings.removeButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemRemove(toRemove))
							self.doRemoveItem(toRemove);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setRemoveFunc($(el));
					}

				});

			}

			setRemoveFunc($(e));

			var setEditFunc = function(rootEl) {

				rootEl.children(self.settings.editButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemEdit(toRemove, toRemove.data("index")))
							self.doEditItem(toRemove);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setEditFunc($(el));
					}

				});

			}

			setEditFunc(toRemove);


			var setCloneFunc = function(rootEl) {

				rootEl.children(self.settings.cloneButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemClone(toRemove))
							self.doCloneItem(toRemove);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setCloneFunc($(el));
					}

				});

			}

			setCloneFunc(toRemove);

		});
		//***


		self.sortItems();

		self.showStatus("Initializing");

		return this;

	}

	this.doAddItem = function(data) {
		
		var self = this;

		var items = this.parent.children(this.settings.cloneableElement);
		
		if(self.template !== undefined) {
			
			var last = items.length == 0? undefined: items.last();
			var newItem = self.template.clone(true);
			newItem.find("*").off("click");

			if(last === undefined)
				self.parent.append(newItem);
			else 
				newItem.insertAfter(last);

			newItem.css("display", self.settings.defaultItemDisplay);

			var setSetupFunc = function(rootEl) {

				rootEl.children().each(function(index, elm) {
					
					var el = $(elm);

					if(el.isDynamicList()) {

						var settings = el.data("dynamic-list-settings");
						var dl = el.dynamicList(settings);
						dl.doClearItems();

					} else {

						setSetupFunc(el);

					}

				});

			}

			setSetupFunc(newItem);

			var setRemoveFunc = function(rootEl) {

				rootEl.children(self.settings.removeButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemRemove(newItem))
							self.doRemoveItem(newItem);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setRemoveFunc($(el));
					}

				});

			}

			setRemoveFunc(newItem);

			var setEditFunc = function(rootEl) {

				rootEl.children(self.settings.editButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemEdit(newItem, newItem.data("index")))
							self.doEditItem(newItem);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setEditFunc($(el));
					}

				});

			}

			setEditFunc(newItem);

			var setCloneFunc = function(rootEl) {

				rootEl.children(self.settings.cloneButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemClone(newItem))
							self.doCloneItem(newItem);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setCloneFunc($(el));
					}

				});

			}

			setCloneFunc(newItem);

			if(data === undefined)
				data = self.settings.defaultData;
			
			for(k in data) {

				var el = newItem.find(k);
				var elData = data[k];
				for(attr in elData) {

					if(attr === "value")
						el.val(elData[attr]);
					else if(attr === "text")
						el.text(elData[attr]);
					else
						el.attr(attr, elData[attr]);

				}

			}

			newItem.data("sort", data.sortValue);
			

		} else {

			self.error("Nenhum elemento com o seletor " + self.settings.cloneableElement + " foi encontrado!");

		}

		componentHandler.upgradeElement(newItem.get(0));
		newItem.find("*").each(function() {
			
			componentHandler.upgradeElement(this);

		});

		componentHandler.upgradeDom();

		self.settings.onItemAdded(newItem);

		self.showStatus("Adding");

		self.sortItems();

		newItem.css("min-height", "0");
		newItem.css("min-width", "0");
		newItem.css("border-radius", "50px");
		newItem.css("width", "72px");
		var anim = new Animation(newItem).doSequentially(
			new Animation().doAnimate(
				{"width": "100%", specialEasing: {width: "linear"}},
				{duration: 200, queue: false}
			), 
			new Animation().doAnimate(
				{"border-radius": "2px", specialEasing: {"border-radius": "linear"}},
				{duration: 50, queue: false}
			)
		).doPlay();

		return newItem;
		
	} 

	this.doCloneItem = function(item) {
		
		var self = this;

		var items = this.parent.children(this.settings.cloneableElement);
		
		if(self.template !== undefined) {
			
			var last = items.length == 0? undefined: items.last();
			var newItem = item.clone(true);
			newItem.data("sort", item.data("sort"));
			newItem.find("*").off("click");


			if(last === undefined)
				self.parent.append(newItem);
			else 
				newItem.insertAfter(last);

			newItem.css("display", self.settings.defaultItemDisplay);

			var setSetupFunc = function(rootEl) {

				rootEl.children().each(function(index, elm) {
					
					var el = $(elm);

					if(el.isDynamicList()) {

						var settings = el.data("dynamic-list-settings");
						var dl = el.dynamicList(settings);
						dl.doClearItems();

					} else {

						setSetupFunc(el);

					}

				});

			}

			setSetupFunc(newItem);

			var setRemoveFunc = function(rootEl) {

				rootEl.children(self.settings.removeButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemRemove(newItem))
							self.doRemoveItem(newItem);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setRemoveFunc($(el));
					}

				});

			}

			setRemoveFunc(newItem);

			var setEditFunc = function(rootEl) {

				rootEl.children(self.settings.editButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemEdit(newItem, newItem.data("index")))
							self.doEditItem(newItem);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setEditFunc($(el));
					}

				});

			}

			setEditFunc(newItem);

			var setCloneFunc = function(rootEl) {

				rootEl.children(self.settings.cloneButton).each(function(index, el) {
					
					$(el).click(function() {

						if(self.settings.onItemClone(newItem))
							self.doCloneItem(newItem);
						
					})

				});

				rootEl.children().each(function(index, el) {
					
					if(!$(el).isDynamicList()) {
						setCloneFunc($(el));
					}

				});

			}

			setCloneFunc(newItem);

			newItem.data("sort", item.data("sortValue"));

		} else {

			self.error("Nenhum elemento com o seletor " + self.settings.cloneableElement + " foi encontrado!");

		}

		componentHandler.upgradeElement(newItem.get(0));
		newItem.find("*").each(function() {
			
			componentHandler.upgradeElement(this);

		});

		componentHandler.upgradeDom();

		self.settings.onItemAdded(newItem);

		self.showStatus("Adding");

		self.sortItems();

		newItem.css("min-height", "0");
		newItem.css("min-width", "0");
		newItem.css("border-radius", "50px");
		newItem.css("width", "72px");
		var anim = new Animation(newItem).doSequentially(
			new Animation().doAnimate(
				{"width": "100%", specialEasing: {width: "linear"}},
				{duration: 200, queue: false}
			), 
			new Animation().doAnimate(
				{"border-radius": "2px", specialEasing: {"border-radius": "linear"}},
				{duration: 50, queue: false}
			)
		).doPlay();

		return newItem;
		
	} 

	this.doRemoveItem = function(item) {

		var self = this;
		var items = self.parent.children(self.settings.cloneableElement);

		if(items.length > 0) {

			el = item;
				
			el.css("min-height", "0px");
			el.css("min-width", "0px");
			el.css("margin-left", "auto");
			
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
				item.find("*").remove();
				item.remove();
				self.settings.onItemRemoved(item);
				self.sortItems();
			}, 250);		

		}

		self.showStatus("Removing");

	}

	this.doEditItem = function(index, data) {

		var self = this;
		var item = $(self.parent.children(self.settings.cloneableElement)[index]);

		for(k in data) {

			var el = item.find(k);
			var elData = data[k];
			for(attr in elData) {

				if(attr === "value")
					el.val(elData[attr]);
				else if(attr === "text")
					el.text(elData[attr]);
				else
					el.attr(attr, elData[attr]);

			}

		}

		item.data("sort", data.sortValue);

		this.sortItems();

		var anim = new Animation(item).doSequentially(
			new Animation().doAnimate(
				{"margin-left": "-16px", specialEasing: {"margin-left": "linear"}},
				{duration: 100, queue: false}
			), 
			new Animation().doAnimate(
				{"margin-left": "16px", specialEasing: {"margin-left": "linear"}},
				{duration: 100, queue: false}
			), 
			new Animation().doAnimate(
				{"margin-left": "-16px", specialEasing: {"margin-left": "linear"}},
				{duration: 100, queue: false}
			), 
			new Animation().doAnimate(
				{"margin-left": "0px", specialEasing: {"margin-left": "linear"}},
				{duration: 100, queue: false}
			)
		).doPlay();

		return item;

	}

	this.doClearItems = function() {
		
		var self = this;
		self.parent.children(self.settings.cloneableElement).each(function(i, el) {

			if(i > 0) 
				self.doRemoveItem($(this));
			
		});

		self.showStatus("Clearing");

	} 

	this.getSettings = function() {

		var settings = JSON.parse(JSON.stringify(this.settings));
		settings.onItemAdd = undefined;
		settings.onItemAdded = undefined;
		settings.onItemRemove = undefined;
		settings.onItemRemoved = undefined;
		settings.onItemEdit = undefined;
		settings.onItemEdited = undefined;
		return settings;

	}

};

DynamicList.objectCount = 0;