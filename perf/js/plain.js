import { generateObj, generateObjWithConstructor } from './helper';

class Object0 {
  constructor() {
    return generateObj('');
  }
}

let SubObject = (Base) => class {
  constructor() {
    return generateObjWithConstructor(Base);
  }
}

let Object1 = SubObject(Object0);
let Object2 = SubObject(Object1);
let Object3 = SubObject(Object2);
let Object4 = SubObject(Object3);

function reduceObject4(obj4) {
  var obj3 = obj4.t3;
  var obj2 = obj3.t2;
  var obj1 = obj2.t1;
  var obj0 = obj1.t0;
  var obj0 = Object.assign({}, obj0, {t0: 0});
  var obj1 = Object.assign({}, obj1, {t1: obj0});
  var obj2 = Object.assign({}, obj2, {t2: obj1});
  var obj3 = Object.assign({}, obj3, {t3: obj2});
  var obj4 = Object.assign({}, obj4, {t4: obj3});
  return obj4;
}

function oneRoute() {
  reduceObject4(new Object4);
}

var t0 = performance.now();
for (let i = 0; i < 1; ++i) {
  oneRoute();
}
var t1 = performance.now();
console.log("plain take " + (t1 - t0) + "milliseconds");
