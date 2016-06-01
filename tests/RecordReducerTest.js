import RecordReducer from '../lib/RecordReducer';
import { expect } from 'chai';

describe('RecordReducer', function () {
  it('set the default values', function () {
    class TypeA extends RecordReducer({a: 1}) {
      constructor(values) {
        super(values || {a: 22});
      }
    }

    var t = new TypeA;
    expect(t.a).to.equal(22);
    var t2 = t.set('a', 11);
    expect(t2.a).to.equal(11);
  })

  it('contains one reducer', function () {
    class TypeA extends RecordReducer({a: 1}) {}
    class TypeB extends RecordReducer({valueA: new TypeA}) {
      constructor() {
        super(...arguments);
        var disposable = this.valueA.subscribe((reducer) => {
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
    class TypeA extends RecordReducer({a: 1}) {}
    class TypeB extends RecordReducer({
      valueA: new TypeA,
      valueB: new TypeA,
    }) {
      constructor() {
        super(...arguments);
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

  it('monitorAllValues', function () {
    class TypeA extends RecordReducer({a: 1}) {}
    class TypeB extends RecordReducer({
      valueA: new TypeA,
      valueB: new TypeA,
    }) {
      constructor() {
        super(...arguments);
        this.monitorAllValues();
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

    a2.trigger(a2.set('a', 3));
    expect(a2._subscribers.length).to.equal(0);
  })

  it('monitorValues', function () {
    class TypeA extends RecordReducer({a: 1}) {}
    class TypeB extends RecordReducer({
      valueA: new TypeA,
      valueB: new TypeA,
    }) {
      constructor() {
        super(...arguments);
        this.monitorValues('valueA');
      }
    }

    var b1 = new TypeB;
    var a1 = b1.valueA;
    var a2 = b1.valueB;
    var b2;
    b1.subscribe((newRd) => { b2 = newRd; });
    a1.trigger(a1.set('a', 3));
    expect(b2).not.to.equal(b1);

    b2 = null;
    a2.trigger(a2.set('a', 4));
    expect(b2).to.be.null;
  })
});
