var Observer = (function() {
	var __store = '__store';
	var _payload = '_payload';
	if (Symbol) {
		__store = Symbol(__store);
		_payload = Symbol(_payload);
	}
	function Observer() {
		this[__store] = {};
		this[_payload] = {};
	}
	Observer.prototype.emit = function(type, playload, context) {
		if (!this[__store][type]) return;
		if (context) {
			this[__store][type].forEach((v, k) => {
				v.call(context, playload);
			});
		} else {
			this[__store][type].forEach((v, k) => {
				v(playload);
			});
		}
	};
	Observer.prototype.preEmit = function(type, playload, context) {
    console.log("--------------")
		if (!this[__store][type]) {
			this[_payload][type] = {
				playload,
				context
			};
			return;
		}
		this.emit(type, playload, context);
	};
	// 重复触发事件注册
	Observer.prototype.on = function(type, callback) {
		if (!this[__store][type]) {
			this[__store][type] = [ callback ];
		} else {
			this[__store][type].push(callback);
		}
		if (this[_payload][type]) {
			const { playload, context } = this[_payload][type];
			this.emit(type, playload, context);
			this[_payload][type] = null;
		}
	};
	// 移除事件
	Observer.prototype.remove = function(type, fn) {
		if (!type || !this[__store][type]) return;
		if (fn && typeof fn === 'function') {
			this[__store][type] = this[__store][type].filter((v) => v !== fn);
		} else {
			this[__store][type] = [];
		}
	};
	// 单次触发事件注册
	Observer.prototype.once = function(type, callback) {
		if (!type) return;
		var _this = this;
		var anonym = (function() {
			var fn = function(playload, context) {
				if (context) {
					callback.call(context, playload);
				} else {
					callback(playload);
				}
				_this.remove(type, fn);
			};
			return fn;
		})();
		if (!this[__store][type]) {
			this[__store][type] = [ anonym ];
		} else {
			this[__store][type].push(anonym);
		}
	};
	return Observer;
})();

export default new Observer();
