import { Seq } from 'immutable';
import Record from '../lib/Record';
import { expect } from 'chai';

describe('Record', () => {

  it('defines a constructor', function () {
    var MyType = Record({a:1, b:2, c:3});

    var t1 = new MyType();
    var t2 = t1.set('a', 10);
    var t3 = t2.clear();

    expect(t1 instanceof Record).to.equal(true);
    expect(t1 instanceof MyType).to.equal(true);

    expect(t3 instanceof Record).to.equal(true);
    expect(t3 instanceof MyType).to.equal(true);

    expect(t1.get('a')).to.equal(1);
    expect(t2.get('a')).to.equal(10);

    expect(t1.size).to.equal(3);
    expect(t2.size).to.equal(3);
  })

  it('passes through records of the same type', function () {
    var P2 = Record({ x: 0, y: 0 });
    var P3 = Record({ x: 0, y: 0, z: 0 });
    var p2 = P2();
    var p3 = P3();
    expect(P3(p2) instanceof P3).to.equal(true);
    expect(P2(p3) instanceof P2).to.equal(true);
    expect(P2(p2)).to.equal(p2);
    expect(P3(p3)).to.equal(p3);
  })

  it('only allows setting what it knows about', function () {
    var MyType = Record({a:1, b:2, c:3});

    var t1 = new MyType({a: 10, b:20});
    expect(() => {
      t1.set('d', 4);
    }).to.throw('Cannot set unknown key "d" on Record');
  });

  it('has a fixed size and falls back to default values', function () {
    var MyType = Record({a:1, b:2, c:3});

    var t1 = new MyType({a: 10, b:20});
    var t2 = new MyType({b: 20});
    var t3 = t1.remove('a');
    var t4 = t3.clear();

    expect(t1.size).to.equal(3);
    expect(t2.size).to.equal(3);
    expect(t3.size).to.equal(3);
    expect(t4.size).to.equal(3);

    expect(t1.get('a')).to.equal(10);
    expect(t2.get('a')).to.equal(1);
    expect(t3.get('a')).to.equal(1);
    expect(t4.get('b')).to.equal(2);

    expect(t2.equals(t3)).to.equal(true);
    expect(t2.equals(t4)).to.equal(false);
    expect(t4.equals(new MyType())).to.equal(true);
  })

  it('converts sequences to records', function () {
    var MyType = Record({a:1, b:2, c:3});
    var seq = Seq({a: 10, b:20});
    var t = new MyType(seq);
    expect(t.toObject()).to.eql({a:10, b:20, c:3})
  })

  it('allows for functional construction', function () {
    var MyType = Record({a:1, b:2, c:3});
    var seq = Seq({a: 10, b:20});
    var t = MyType(seq);
    expect(t.toObject()).to.eql({a:10, b:20, c:3})
  })


  it('skips unknown keys', function () {
    var MyType = Record({a:1, b:2});
    var seq = Seq({b:20, c:30});
    var t = new MyType(seq);

    expect(t.get('a')).to.equal(1);
    expect(t.get('b')).to.equal(20);
    expect(t.get('c')).to.be.undefined;
  })

  it('returns itself when setting identical values', function () {
    var MyType = Record({a:1, b:2});
    var t1 = new MyType;
    var t2 = new MyType({a: 1});
    var t3 = t1.set('a', 1);
    var t4 = t2.set('a', 1);
    expect(t3).to.equal(t1);
    expect(t4).to.equal(t2);
  })

  it('returns new record when setting new values', function () {
    var MyType = Record({a:1, b:2});
    var t1 = new MyType;
    var t2 = new MyType({a: 1});
    var t3 = t1.set('a', 3);
    var t4 = t2.set('a', 3);
    expect(t3).not.to.equal(t1);
    expect(t4).not.to.equal(t2);
  })

  it('invoke the subclass constructor', function () {
    var isInvoked = false;
    var MyType = class extends Record({a:1, b: 2}) {
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
