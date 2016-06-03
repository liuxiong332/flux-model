import { Reducer } from 'flux-reducer';
import { Record } from 'immutable';
import { generateObj, generateObjWithFn } from './helper';

class Reducer0 extends Reducer(generateObj('')) {
  static create() {
    return new Reducer0();
  }
};

let SubReducer = (Base) => {
  let SubClass = class extends Reducer(generateObj('')) {
    static create() {
      let reducer = new SubClass(generateObjWithFn(Base.create));
      reducer.initOnce();
      reducer.monitorAllValues();
      return reducer;
    }
  };
  return SubClass;
}

let Reducer1 = SubReducer(Reducer0);
let Reducer2 = SubReducer(Reducer1);
let Reducer3 = SubReducer(Reducer2);
let Reducer4 = SubReducer(Reducer3);
let Reducer5 = SubReducer(Reducer4);
let Reducer6 = SubReducer(Reducer5);
let Reducer7 = SubReducer(Reducer6);
let Reducer8 = SubReducer(Reducer7);
let Reducer9 = SubReducer(Reducer8);

function oneRoute() {
  let reducer4 = Reducer4.create();
  let subscription = reducer4.subscribe(reducerHandler);

  function reducerHandler(newRd) {
    subscription.dispose();
    subscription = newRd.subscribe(reducerHandler);
  }
  let reducer0 = reducer4.t3.t2.t1.t0;
  reducer0.trigger(reducer0.set('t0', 'change'));
}

var t0 = performance.now();
for (let i = 0; i < 1; ++i) {
  oneRoute();
}
var t1 = performance.now();
console.log("reducer take " + (t1 - t0) + "milliseconds");
