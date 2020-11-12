class ArrayStack {
  store: any[];

  constructor() {
    this.store = [];
  }

  push<T>(value: T) {
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
  mainStack: ArrayStack;
  forwardStack: ArrayStack;
  go: any;

  constructor() {
    this.mainStack = new ArrayStack();
    this.forwardStack = new ArrayStack();
    this.go = this.forward.bind(this);
  }

  get canForward() {
    return !!this.forwardStack.size;
  }

  get isEmptyMainStack() {
    return this.mainStack.size <= 0;
  }

  get canBack() {
    return this.mainStack.size > 1;
  }

  get firstMainStack() {
    return this.mainStack.store[this.mainStack.size - 1];
  }

  get firstForwardStack() {
    return this.forwardStack.store[this.forwardStack.size - 1];
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

  replace<T>(value: T) {
    if (this.isEmptyMainStack) return false;
    this.mainStack.pop();
    this.mainStack.push(value);
    this.forwardStack.clear();
    return true;
  }

  push<T>(value: T) {
    if (!value) return;
    this.mainStack.push(value);
    this.forwardStack.clear();
  }
}

export default new ForwardAndBack();
