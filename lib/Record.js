import { Iterable, Collection, Map } from 'immutable'

const KeyedIterable = Iterable.Keyed;
const KeyedCollection = Collection.Keyed;

export default function Record(values) {
  if (values instanceof Record) {
    return values;
  }
  if (!(this instanceof Record)) {
    return new Record(values);
  }
  this._map = Map(values);
  this.size = this._map.size;
}

var RecordPrototype = Record.prototype = Object.create(KeyedCollection.prototype);
RecordPrototype.constructor = Record;

Object.assign(RecordPrototype, {
  toString() {
    return this.__toString(recordName(this) + ' {', '}');
  },

  // @pragma Access

  has(k) {
    return this._map.has(k);
  },

  get(k, notSetValue) {
    return this._map.get(k, notSetValue);
  },

  // @pragma Modification

  clear() {
    if (this.__ownerID) {
      this._map.clear();
      return this;
    }
    var RecordType = this.constructor;
    return RecordType._empty || (RecordType._empty = makeRecord(this, Map()));
  },

  set(k, v) {
    var newMap = this._map.set(k, v);
    if (this.__ownerID || newMap === this._map) {
      return this;
    }
    return makeRecord(this, newMap);
  },

  remove(k) {
    var newMap = this._map.remove(k);
    if (this.__ownerID || newMap === this._map) {
      return this;
    }
    return makeRecord(this, newMap);
  },

  wasAltered() {
    return this._map.wasAltered();
  },

  __iterator(type, reverse) {
    return this._map.__iterator(type, reverse);
  },

  __iterate(fn, reverse) {
    return this._map.__iterate(fn, reverse);
  },

  __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    var newMap = this._map.__ensureOwner(ownerID);
    if (!ownerID) {
      this.__ownerID = ownerID;
      this._map = newMap;
      return this;
    }
    return makeRecord(this, newMap, ownerID);
  },
});

const MapPrototype = Map.prototype;
RecordPrototype['delete'] = RecordPrototype.remove;
RecordPrototype.deleteIn =
RecordPrototype.removeIn = MapPrototype.removeIn;
RecordPrototype.merge = MapPrototype.merge;
RecordPrototype.mergeWith = MapPrototype.mergeWith;
RecordPrototype.mergeIn = MapPrototype.mergeIn;
RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
RecordPrototype.setIn = MapPrototype.setIn;
RecordPrototype.update = MapPrototype.update;
RecordPrototype.updateIn = MapPrototype.updateIn;
RecordPrototype.withMutations = MapPrototype.withMutations;
RecordPrototype.asMutable = MapPrototype.asMutable;
RecordPrototype.asImmutable = MapPrototype.asImmutable;


function makeRecord(likeRecord, map, ownerID) {
  var record;
  if (likeRecord.constructor) {
    record = new likeRecord.constructor(map);
  } else {
    record = Object.create(Object.getPrototypeOf(likeRecord));
    record._map = map;
    record.size = map.size;
  }
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.name || 'Record';
}
