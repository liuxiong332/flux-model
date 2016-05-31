
import { List, Iterable, Collection } from 'immutable'

export default function ArrayRecord(values) {
  if (values instanceof ArrayRecord) {
    return values;
  }
  if (!(this instanceof ArrayRecord)) {
    return new ArrayRecord(values);
  }
  this._list = List(values);
  this.size = this._list.size;
}

var ArrayRecordPrototype = ArrayRecord.prototype =
  Object.create(Collection.Indexed.prototype);
ArrayRecordPrototype.constructor = ArrayRecord;

Object.assign(ArrayRecordPrototype, {
  toString() {
    return this.__toString(recordName(this) + ' {', '}');
  },

  // @pragma Access

  get(index, notSetValue) {
    return this._list.get(index, notSetValue);
  },

  // @pragma Modification

  clear() {
    if (this.__ownerID) {
      this._list && this._list.clear();
      return this;
    }
    var RecordType = this.constructor;
    return RecordType._empty || (RecordType._empty = makeRecord(this, List()));
  },

  // @pragma Composition

  wasAltered() {
    return this._list.wasAltered();
  },

  // @pragma Iteration

  __iterator(type, reverse) {
    return this._list.__iterator(type, reverse);
  },

  __iterate(fn, reverse) {
    return this._list.__iterate(fn, reverse);
  },

  __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newList = this._list && this._list.__ensureOwner(ownerID);
    if (!ownerID) {
      this.__ownerID = ownerID;
      this._list = newList;
      return this;
    }
    return makeRecord(this, newList, ownerID);
  },
});

['set', 'remove', 'insert', 'push', 'pop', 'unshift', 'shift', 'merge',
  'mergeWith', 'mergeDeep', 'mergeDeepWith', 'setSize', 'slice'
].forEach((name) => {
  ArrayRecordPrototype[name] = function () {
    var newList = this._list[name](...arguments);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  };
});

var ListPrototype = List.prototype;

ArrayRecordPrototype['delete'] = ArrayRecordPrototype.remove;
ArrayRecordPrototype.setIn = ListPrototype.setIn;
ArrayRecordPrototype.deleteIn =
ArrayRecordPrototype.removeIn = ListPrototype.removeIn;
ArrayRecordPrototype.update = ListPrototype.update;
ArrayRecordPrototype.updateIn = ListPrototype.updateIn;
ArrayRecordPrototype.mergeIn = ListPrototype.mergeIn;
ArrayRecordPrototype.mergeDeepIn = ListPrototype.mergeDeepIn;
ArrayRecordPrototype.withMutations = ListPrototype.withMutations;
ArrayRecordPrototype.asMutable = ListPrototype.asMutable;
ArrayRecordPrototype.asImmutable = ListPrototype.asImmutable;


function makeRecord(likeRecord, list, ownerID) {
  var Prototype = Object.getPrototypeOf(likeRecord);
  var record;
  if (Prototype.constructor) {
    record = new Prototype.constructor(list);
  } else {
    record = Object.create(Prototype);
    record._list = list;
    record.size = list.size;
  }
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.name || 'Record';
}
