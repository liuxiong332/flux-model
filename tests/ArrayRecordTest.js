import { Seq, Map } from 'immutable';
import ArrayRecord from '../lib/ArrayRecord';
import { expect } from 'chai';

describe.only('ArrayRecord', () => {

  it('defines a constructor', function () {
    var t1 = ArrayRecord([1, 2, 3]);
    expect(t1.size).to.equal(3);
    expect(t1 instanceof ArrayRecord).to.equal(true);

    var t2 = t1.set(1, 10);
    expect(t2.get(1)).to.equal(10);
    expect(t2.toArray()).to.eql([1, 10, 3]);

    var t3 = t1.set(4, 11);
    expect(t3.get(4)).to.equal(11);
  })

  it('insert and remove elements', function () {
    var t1 = ArrayRecord([1, 2, 3]);

    var t4 = t1.remove(2);
    expect(t4.toArray()).to.eql([1, 2]);

    var t5 = t1.clear();
    expect(t5.size).to.equal(0);

    var t6 = t1.insert(0, 12);
    expect(t6.toArray()).to.eql([12, 1, 2, 3]);
  })

  it('push and pop element', function () {
    var t1 = ArrayRecord([1, 2, 3]);

    var t7 = t1.push(4, 5);
    expect(t7.toArray()).to.eql([1, 2, 3, 4, 5]);
    expect(t7 instanceof ArrayRecord).to.true;

    var t8 = t7.pop();
    expect(t8.toArray()).to.eql([1, 2, 3, 4]);
    expect(t8 instanceof ArrayRecord).to.true;
  })

  it('unshift and shift elements', function () {
    var t1 = ArrayRecord([1, 2, 3]);

    var t2 = t1.unshift(4, 5, 6);
    expect(t2.toArray()).to.eql([4, 5, 6, 1, 2, 3]);
    expect(t2 instanceof ArrayRecord).to.true;

    var t3 = t1.shift();
    expect(t3.toArray()).to.eql([2, 3]);
    expect(t3 instanceof ArrayRecord).to.true;
  })

  it('shadow merge elements', function () {
    var t1 = ArrayRecord([1, 2, 3]);

    var t2 = t1.merge([4, 5, 6, 7]);
    expect(t2.toArray()).to.eql([4, 5, 6, 7]);
    expect(t2 instanceof ArrayRecord).to.true;

    var t3 = t1.merge([4, 5]);
    expect(t3.toArray()).to.eql([4, 5, 3]);

    var t4 = t1.mergeWith((prev, next) => prev + next, [4, 5]);
    expect(t4.toArray()).to.eql([5, 7, 3]);
  })

  it('deep merge elements', function () {
    var t1 = ArrayRecord([Map({x: 10}), {y: 10}, 3]);

    var t2 = t1.mergeDeep([{m: 20}]);
    expect(t2.toJS()).to.eql([{x: 10, m: 20}, {y: 10}, 3]);

    var t3 = t1.mergeDeepWith((prev, next) => prev + next, [{x: 20, y: 1}]);
    expect(t3.toJS()).to.eql([{x: 30, y: 1}, {y: 10}, 3]);
  })

  it('resize size', function () {
    var t1 = ArrayRecord([1, 2, 3]);
    var t2 = t1.setSize(1);
    expect(t2.toArray()).to.eql([1]);
  })

  it('slice the new record with begin and end index', function () {
    var t1 = ArrayRecord([1, 2, 3]);
    var t2 = t1.slice(1);
    expect(t2.toArray()).to.eql([2, 3]);
    var t3 = t1.slice(0, -1);
    expect(t3.toArray()).to.eql([1, 2]);
  })

  it('the derived class will invoke the constructor', function () {
    let isInvoke = false;
    var MyType = class extends ArrayRecord {
      constructor() {
        super(...arguments);
        isInvoke = true;
      }
    };
    var t = new MyType([1, 2]);
    expect(isInvoke).to.true;
    var t2 = t.set(0, 11);
    expect(t2.toArray()).to.eql([11, 2]);
    expect(t2 instanceof MyType).to.true;
  })
});
