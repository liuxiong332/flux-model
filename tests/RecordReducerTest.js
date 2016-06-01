import RecordReducer from '../lib/RecordReducer';
import { expect } from 'chai';

describe('RecordReducer', function () {
  it('contains one reducer', function () {
    class TypeA extends RecordReducer {
      constructor(values) {
        super(values || {a: 1});
      }
    }
    class TypeB extends RecordReducer {
      constructor(values) {
        super(values || {valueA: new TypeA});
        var disposable = this.get('valueA').subscribe((reducer) => {
          this.trigger(this.set('valueA', reducer));
        });
        this.addDisposable(disposable);
      }
    };

    var b1 = new TypeB;
    var a1 = b1.valueA;
    expect(a1._subscribers.length).to.equal(1);

    var b2 = null;
    b1.subscribe((newB) => {
      b2 = newB;
    });
    var a2 = b1.valueA.set('a', 2);
    b1.valueA.trigger(a2);
    expect(a1._subscribers.length).to.eql(0);
    expect(b1._subscriptions.disposed).to.true;

    expect(a2._subscribers.length).to.eql(1);
  })

  it('contains many reducers', function () {
    class TypeA extends RecordReducer {
      constructor(values) {
        super(values || {a: 1});
      }
    }
    class TypeB extends RecordReducer {
      constructor(values) {
        super(values || {
          valueA: new TypeA,
          valueB: new TypeA,
        });
        this.addDisposable(this.valueA.subscribe((reducer) => {
          this.trigger(this.set('valueA', reducer));
        }));
        this.addDisposable(this.valueB.subscribe(reducer => {
          this.trigger(this.set('valueB', reducer));
        }));
      }
    }
    var b1 = new TypeB;
    var a1 = b1.valueA;
    var a2 = b1.valueB;
    expect(a1._subscribers.length).to.equal(1);
    expect(a2._subscribers.length).to.equal(1);

    a1.trigger(a1.set('a', 2));
    expect(a1._subscribers.length).to.equal(0);
    expect(a2._subscribers.length).to.equal(1);
  })
});
