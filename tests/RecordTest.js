import { Seq } from 'immutable';
import Record from '../lib/Record';
import { expect } from 'chai';

describe('Record', () => {

  it('defines a constructor', function () {
    var t1 = new Record({a:1, b:2, c:3});
    var t2 = t1.set('a', 10);
    var t3 = t2.clear();

    expect(t1 instanceof Record).to.equal(true);

    expect(t3 instanceof Record).to.equal(true);

    expect(t1.get('a')).to.equal(1);
    expect(t2.get('a')).to.equal(10);

    expect(t1.size).to.equal(3);
    expect(t3.size).to.equal(0);
  })

  it('converts sequences to records', function () {
    var seq = Seq({a: 10, b:20});
    var t = new Record(seq);
    expect(t.toObject()).to.eql({a:10, b:20})
  })

  it('returns itself when setting identical values', function () {
    var t1 = new Record({a:1, b:2});
    var t3 = t1.set('a', 1);
    expect(t3).to.equal(t1);
  })

  it('returns new record when setting new values', function () {
    var t1 = new Record({a:1, b:2});
    var t3 = t1.set('a', 3);
    expect(t3).not.to.equal(t1);
  })

  it('invoke the subclass constructor', function () {
    var isInvoked = false;
    var MyType = class extends Record {
      constructor() {
        super(...arguments);
        isInvoked = true;
      }
    };
    var t1 = new MyType();
    var t2 = t1.set('a', 3);
    expect(t2 instanceof MyType).to.true;
    expect(isInvoked).to.true;
  })
});
