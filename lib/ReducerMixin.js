import {CompositeDisposable} from 'event-kit'

let ReducerMixin = (Record) => class extends Record {
  constructor() {
    super(...arguments);
    this._subscriptions = new CompositeDisposable;
    this._subscribers = [];
  }

  initWithCallback(callback) {
    this._initializer = callback;
    callback(this);
    return this;
  }

  addDisposable() {
    this._subscriptions.add(...arguments);
  }

  dispose() {
    this._subscriptions.dispose();
  }

  subscribe(callback) {
    let subscribers = this._subscribers;
    subscribers.push(callback);
    let disposable = {
      dispose: () => {
        var index = subscribers.indexOf(callback);
        index !== -1 && subscribers.splice(index, 1);
      },
    };
    return disposable;
  }

  trigger(newInstance) {
    if (newInstance === this) return;
    this.dispose();
    if (this._initializer) {
      newInstance.initWithCallback(this._initializer);
    }
    let subscribers = this._subscribers.slice(0);
    let length = subscribers.length;
    for (let i = 0; i < length; ++i) {
      subscribers[i](newInstance);
    }
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
