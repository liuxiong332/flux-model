import ArrayRecord from './ArrayRecord'
import ReducerMixin from './ReducerMixin'

var ArrayRecordReducer = ReducerMixin(ArrayRecord);

Object.assign(ArrayRecordReducer.prototype, {
  monitorAllChildren() {
    this.forEach((reducer, index) => {
      this.addDisposable(reducer.subscribe((newRd) => {
        this.trigger(this.set(index, newRd));
      }));
    });
  }
});

export default ArrayRecordReducer;
