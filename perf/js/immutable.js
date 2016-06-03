import { Record } from 'immutable';
import { generateObj, generateObjWithFn } from './helper';

class Record0 extends Record(generateObj('')) {};

let SubRecord = (Base) => class extends Record(generateObj('')) {
  constructor(values) {
    super(values || generateObjWithFn(Base));
  }
};

let Record1 = SubRecord(Record0);
let Record2 = SubRecord(Record1);
let Record3 = SubRecord(Record2);
let Record4 = SubRecord(Record3);

function reduceRecord4(record4) {
  var record3 = record4.get('t3');
  var record2 = record3.get('t2');
  var record1 = record2.get('t1');
  var record0 = record1.get('t0');
  record0 = record0.set('t0', '0');
  record1 = record1.set('t1', record0);
  record2 = record2.set('t2', record1);
  record3 = record3.set('t3', record3);
  record4 = record4.set('t4', record4);
  return record4;
}

function oneRoute() {
  reduceRecord4(new Record4);
}

var t0 = performance.now();
for (let i = 0; i < 10; ++i) {
  oneRoute();
}
var t1 = performance.now();
console.log("immutable take " + (t1 - t0) + "milliseconds");
