'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ArrayRecord;

var _immutable = require('immutable');

function ArrayRecord(values) {
  if (values instanceof ArrayRecord) {
    return values;
  }
  if (!(this instanceof ArrayRecord)) {
    return new ArrayRecord(values);
  }
  this._list = (0, _immutable.List)(values);
}

var ArrayRecordPrototype = ArrayRecord.prototype = Object.create(_immutable.Collection.Indexed.prototype);
ArrayRecordPrototype.constructor = ArrayRecord;

Object.assign(ArrayRecordPrototype, {
  toString: function toString() {
    return this.__toString(recordName(this) + ' {', '}');
  },


  // @pragma Access

  get: function get(index, notSetValue) {
    return this._list.get(index, notSetValue);
  },


  // @pragma Modification

  set: function set(k, v) {
    var newList = this._list.set(k, v);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  },
  clear: function clear() {
    if (this.__ownerID) {
      this._list && this._list.clear();
      return this;
    }
    var RecordType = this.constructor;
    return RecordType._empty || (RecordType._empty = makeRecord(this, (0, _immutable.List)()));
  },
  remove: function remove(index) {
    var newList = this._list && this._list.remove(index);
    if (this.__ownerID || newList === this._list) {
      return this;
    }
    return makeRecord(this, newList);
  },
  insert: function insert(index, value) {
    var newList = this._list.insert(index, value);
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },
  push: function push() /*...values*/{
    var newList = this._list.push(arguments);
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },
  pop: function pop() {
    var newList = this._list.pop();
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },
  unshift: function unshift() /*...values*/{
    var newList = this._list.unshift(arguments);
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },
  shift: function shift() {
    var newList = this._list.shift();
    if (this.__ownerID) {
      return this;
    }
    return makeRecord(this, newList);
  },


  // @pragma Composition

  merge: function merge() /*...iters*/{
    return makeRecord(this, this._list.merge(arguments));
  },
  mergeWith: function mergeWith(merger) {
    var _list;

    for (var _len = arguments.length, iters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      iters[_key - 1] = arguments[_key];
    }

    return makeRecord(this, (_list = this._list).mergeWith.apply(_list, [merger].concat(iters)));
  },
  mergeDeep: function mergeDeep() /*...iters*/{
    return makeRecord(this, this._list.mergeDeep(arguments));
  },
  mergeDeepWith: function mergeDeepWith(merger) {
    var _list2;

    for (var _len2 = arguments.length, iters = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      iters[_key2 - 1] = arguments[_key2];
    }

    return makeRecord(this, (_list2 = this._list).mergeDeepWith.apply(_list2, [merger].concat(iters)));
  },
  setSize: function setSize(size) {
    return makeRecord(this, this._list.setSize(size));
  },
  wasAltered: function wasAltered() {
    return this._list.wasAltered();
  },


  // @pragma Iteration

  slice: function slice(begin, end) {
    return makeRecord(this, this._list.slice(begin, end));
  },
  __iterator: function __iterator(type, reverse) {
    return this._list.__iterator(type, reverse);
  },
  __iterate: function __iterate(fn, reverse) {
    return this._list.__iterate(fn, reverse);
  },
  __ensureOwner: function __ensureOwner(ownerID) {
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
  }
});

var ListPrototype = _immutable.List.prototype;

ArrayRecordPrototype['delete'] = ArrayRecordPrototype.remove;
ArrayRecordPrototype.deleteIn = ArrayRecordPrototype.removeIn = ListPrototype.removeIn;
ArrayRecordPrototype.merge = ListPrototype.merge;
ArrayRecordPrototype.mergeWith = ListPrototype.mergeWith;
ArrayRecordPrototype.mergeIn = ListPrototype.mergeIn;
ArrayRecordPrototype.mergeDeep = ListPrototype.mergeDeep;
ArrayRecordPrototype.mergeDeepWith = ListPrototype.mergeDeepWith;
ArrayRecordPrototype.mergeDeepIn = ListPrototype.mergeDeepIn;
ArrayRecordPrototype.setIn = ListPrototype.setIn;
ArrayRecordPrototype.update = ListPrototype.update;
ArrayRecordPrototype.updateIn = ListPrototype.updateIn;
ArrayRecordPrototype.withMutations = ListPrototype.withMutations;
ArrayRecordPrototype.asMutable = ListPrototype.asMutable;
ArrayRecordPrototype.asImmutable = ListPrototype.asImmutable;

function makeRecord(likeRecord, list, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._list = list;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.name || 'Record';
}