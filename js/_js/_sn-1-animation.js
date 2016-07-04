var Animation = function(el) {

	this.el = el;
	this.anim = null;

	this.doAnimate = function(setts, duration) {
		
		var data = {
			type: "animation", 
			setts: setts, 
			duration: duration
		};

		this.anim = data;

		return this;
	};

	this.doSequentially = function() {

		var data = {
			type: "sequentially", 
			anims: []
		};

		for(var i = 0; i < arguments.length; i++)
			data.anims.push(arguments[i].anim);

		this.anim = data;

		return this;

	};

	this.doPlay = function(onComplete) {

		this._play(this.anim, onComplete);
		return this;

	}

	this._play = function(anim, onComplete) {

		var _self = this;

		if(anim.type === "animation") {

			anim.duration.complete = function() {
				if(onComplete != undefined)
					onComplete();
			};

			_self.el.animate(
				anim.setts, 
				anim.duration				
			);

		} else if(anim.type === "sequentially") {

			if(anim.anims.length > 0) {
				var a = anim.anims.splice(0, 1)[0];
				_self._play(a, function() {

					if(onComplete != undefined)
						onComplete();

					_self._play(anim);

				});
			}
			
		} 

	}

};