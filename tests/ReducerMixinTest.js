import ReducerMixin from '../lib/ReducerMixin';
import { expect } from 'chai';

class Base {}

describe.only('ReducerMixin', function () {
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
});
