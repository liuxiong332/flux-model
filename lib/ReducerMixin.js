import {CompositeDisposable} from 'event-kit'

let ReducerMixin = (Record) => class extends Record {
  constructor() {
    super(...arguments);
    this._subscriptions = new CompositeDisposable;
    this._subscribers = [];
  }

  // TODO: Replace this method with once method.
  initWithCallback(callback) {
    this._initializer = callback;
    callback(this);
    return this;
  }

  initOnce() {
    this._onceSubs = new CompositeDisposable;
  }

  disposeFinal() {
    this._onceSubs && this._onceSubs.dispose();
  }

  addDisposable() {
    this._subscriptions.add(...arguments);
  }

  addOnceDisposable() {
    if (!this._onceSubs) {
      throw new Error('please invoke initOnce in static method create.');
    }
    this._onceSubs.add(...arguments);
  }

  dispose() {
    this._subscriptions.dispose();
  }

  moveTo(newReducer) {
    newReducer._onceSubs = this._onceSubs;
    this._onceSubs = null;
  }

  subscribe(callback) {
    this._subscribers.push(callback);
    let disposable = {
      dispose: () => {
        let subscribers = this._subscribers;
        if (subscribers) {
          var index = subscribers.indexOf(callback);
          index !== -1 && subscribers.splice(index, 1);
        }
      },
    };
    return disposable;
  }

  trigger(newInstance) {
    if (newInstance === this) return;
    this.moveTo(newInstance);
    this.dispose();
    if (this._initializer) {
      newInstance.initWithCallback(this._initializer);
    }
    if (this._subscribers) {
      let subscribers = this._subscribers.slice(0);
      let length = subscribers.length;
      for (let i = 0; i < length; ++i) {
        subscribers[i](newInstance);
      }
    }
    this._subscribers = null;
  }

  monitorAllValues() {
    this.forEach((reducer, key) => {
      this.addDisposable(reducer.subscribe((newRd) => {
        this.trigger(this.set(key, newRd));
      }));
    });
  }

  monitorValues(...keys) {
    keys.forEach((key) => {
      this.addDisposable(this.get(key).subscribe((newRd) => {
        this.trigger(this.set(key, newRd));
      }));
    });
  }
}

export default ReducerMixin;
