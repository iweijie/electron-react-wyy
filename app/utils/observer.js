/* eslint-disable no-underscore-dangle */
const ObserverFactory = (function ObserverFactory() {
	function Observer() {
		this.store = {};
		this.payload = {};
	}

	// 触发回调
	Observer.prototype.emit = function(type, playload) {
		if (!this.store[type]) return;
		this.store[type](playload);
	};

	// 前置触发，在没有注册的情况下会存储当前参数，注册时触发一次
	Observer.prototype.preEmit = function(type, playload) {
		if (!this.store[type]) {
			this.payload[type] = {
				playload
			};
			return;
		}
		this.emit(type, playload);
	};

	// 重复触发事件注册
	Observer.prototype.on = function(type, callback) {
		this.store[type] = callback;

		if (this.payload[type]) {
			const { playload } = this.payload[type];
			this.emit(type, playload);
			delete this.payload[type];
		}
	};

	// 移除事件
	Observer.prototype.remove = function(type) {
		if (!type || !this.store[type]) return;
		delete this.store[type];
	};

	// 单次触发事件注册
	Observer.prototype.once = function(type, callback) {
		if (!type) return;
		const _this = this;
		this.store[type] = (function anonym() {
			const fn = function(playload) {
				callback(playload);
				_this.remove(type);
			};
			return fn;
		})();
	};

	return Observer;
})();

export default new ObserverFactory();
