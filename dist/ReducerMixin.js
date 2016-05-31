'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventKit = require('event-kit');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReducerMixin = function ReducerMixin(Record) {
  return function (_Record) {
    _inherits(_class, _Record);

    function _class() {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));

      _this._subscriptions = new _eventKit.CompositeDisposable();
      _this._subscribers = [];
      return _this;
    }

    _createClass(_class, [{
      key: 'addDisposable',
      value: function addDisposable(disposable) {
        this._subscriptions.add(disposable);
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this._subscriptions.dispose();
      }
    }, {
      key: 'subscribe',
      value: function subscribe(callback) {
        var subscribers = this._subscribers;
        subscribers.push(callback);
        var disposable = {
          dispose: function dispose() {
            var index = subscribers.indexOf(callback);
            index !== -1 && subscribers.splice(index, 1);
          }
        };
        return disposable;
      }
    }, {
      key: 'trigger',
      value: function trigger(newInstance) {
        if (newInstance === this) return;
        this.dispose();
        var subscribers = this._subscribers;
        var length = subscribers.length;
        for (var i = 0; i < length; ++i) {
          subscribers[i](newInstance);
        }
      }
    }]);

    return _class;
  }(Record);
};

exports.default = ReducerMixin;