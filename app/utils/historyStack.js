class ArrayStack {
	constructor() {
		this.store = [];
	}
	push(value) {
		if (!value) return;
		this.store.push(value);
	}
	pop() {
		return this.store.pop();
	}
	clear() {
		this.store = [];
	}
	get size() {
		return this.store.length;
	}
}
class ForwardAndBack {
	constructor() {
		this.mainStack = new ArrayStack();
		this.forwardStack = new ArrayStack();
		this.go = this.forward.bind(this);
	}
	get canForward() {
		return !!this.forwardStack.size;
	}
	get canBack() {
		return this.mainStack.size > 1;
	}
	forward() {
		if (this.canForward) {
			const data = this.forwardStack.pop();
			this.mainStack.push(data);
			return data;
		}
		return false;
	}
	back() {
		if (this.canBack) {
			const data = this.mainStack.pop();
			this.forwardStack.push(data);
			return data;
		}
		return false;
	}
	push(value) {
		if (!value) return;
		this.mainStack.push(value);
		this.forwardStack.clear();
	}
}

export default new ForwardAndBack()