import Record from './Record'
import ReducerMixin from './ReducerMixin'

export default function(defaultValues) {
  let RecordReducer = ReducerMixin(Record(defaultValues));
  let prototype = RecordReducer.prototype;
  let {initOnce, moveTo, disposeFinal} = prototype;
  Object.assign(prototype, {
    initOnce() {
      initOnce.call(this);
      this._recordSubs = {};
    },

    moveTo(newReducer) {
      moveTo.call(this, newReducer);
      newReducer._recordSubs = this._recordSubs;
      this._recordSubs = null;
    },

    disposeFinal() {
      disposeFinal.call(this);
      this._recordSubs = null;
    },

    // TODO: check the _recordSubs only in DEV environment.
    _addRecordDis(k, callback) {
      if (!this._recordSubs) {
        throw new Error('please invoke initOnce in static create method.');
      }
      this._recordSubs[k] = callback;
    },

    monitorAllValues() {
      this.forEach((reducer, key) => {
        let callback = reducer.subscribe((newRd) => {
          this.trigger(this.set(key, newRd));
        });
        this._addRecordDis(key, callback);
      });
    },
  });
  return RecordReducer;
}
