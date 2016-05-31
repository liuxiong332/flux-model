import {CompositeDisposable} from 'event-kit'

let ReducerMixin = (Record) => class extends Record {
  constructor() {
    super(...arguments);
    this._subscriptions = new CompositeDisposable;
    this._subscribers = [];
  }

  addDisposable(disposable) {
    this._subscriptions.add(disposable);
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
    let subscribers = this._subscribers;
    let length = subscribers.length;
    for (let i = 0; i < length; ++i) {
      subscribers[i](newInstance);
    }
  }
}

export default ReducerMixin;
