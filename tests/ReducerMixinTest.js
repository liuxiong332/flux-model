import ReducerMixin from '../lib/ReducerMixin';
import { expect } from 'chai';

class Base {}

describe('ReducerMixin', function () {
  it('addDisposable', function () {
    var MyType = ReducerMixin(Base);

    var t1 = new MyType();
    console.log(MyType.prototype.addDisposable);
    console.log(t1.addDisposable);
    var isDisposable = false;
    t1.addDisposable({
      dispose() {
        isDisposable = true;
      }
    });
    t1.dispose();
    expect(isDisposable).to.true;
  })

  it('subscribe and trigger', function () {
    var MyType = ReducerMixin(Base);

    var t = new MyType;
    var hasInvoked = false;
    var disposable = t.subscribe(() => { hasInvoked = true; });

    t.trigger('change');
    expect(hasInvoked).to.true;

    hasInvoked = false;
    disposable.dispose();
    t.trigger('change');
    expect(hasInvoked).to.false;
  })

  it('initWithCallback', function () {
    var MyType = ReducerMixin(Base);

    var t1 = new MyType;
    t1.initWithCallback((t) => {
      t.hasInit = true;
    });
    var t2 = new MyType;
    t1.trigger(t2);
    expect(t1.hasInit).to.true;
    expect(t2.hasInit).to.true;
  })

  it('dispose subscriber in trigger', function () {
    var MyType = ReducerMixin(Base);

    var t1 = new MyType;
    var disposable1 = t1.subscribe(() => {
      disposable1.dispose();
    });
    var disposable2 = t1.subscribe(() => {
      disposable2.dispose();
    });
    t1.trigger(1);
  })
});
