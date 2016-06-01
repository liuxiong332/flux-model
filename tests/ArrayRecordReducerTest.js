import ArrayRecordReducer from '../lib/ArrayRecordReducer';
import { expect } from 'chai';

describe('ArrayRecordReducer', function () {
  it('set the initial state', function () {
    class TypeA extends ArrayRecordReducer {
      constructor(values) {
        super(values || [1, 2, 3]);
      }
    }

    var t = new TypeA();
    expect(t.toJS()).to.eql([1, 2, 3]);
    var t2 = t.push(4);
    expect(t2.toJS()).to.eql([1, 2, 3, 4]);
  })

  it('contains reducer array', function () {
    class TypeA extends ArrayRecordReducer {}
    class TypeB extends ArrayRecordReducer {
      constructor() {
        super(...arguments);
        this.monitorAllValues();
      }

      pushReducer(reducer) {
        var that = this.push(reducer);
        this.trigger(that);
        return that;
      }
    };

    var b1 = new TypeB;
    var a1 = new TypeA;
    var b2 = b1.pushReducer(a1);
    expect(a1._subscribers.length).to.equal(1);

    var a2 = a1.push('dd');
    a1.trigger(a2);
    expect(b2._subscriptions.disposed).to.true;
    expect(a1._subscribers.length).to.equal(0);
    expect(a2._subscribers.length).to.equal(1);
  })
});
