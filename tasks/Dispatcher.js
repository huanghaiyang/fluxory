'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var invariant = require('invariant');

var _ = require('lodash');

var History = {
    back: Symbol(),
    forward: Symbol()
};

var DispatcherHistory = function DispatcherHistory(Dispatcher) {
    return function (_Dispatcher) {
        _inherits(_class, _Dispatcher);

        function _class(args) {
            _classCallCheck(this, _class);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, args));

            _this.payloads = [];

            _this.currentPosition = 0;

            _this.currentPositions = {};

            _this.groups = {};
            return _this;
        }

        _createClass(_class, [{
            key: '_invokeCallback',
            value: function _invokeCallback(id) {
                _get(Object.getPrototypeOf(_class.prototype), '_invokeCallback', this).call(this, id);
                this.payloads.push(this._pendingPayload);
            }
        }, {
            key: 'dispatch',
            value: function dispatch(payload, history, actionType) {
                _get(Object.getPrototypeOf(_class.prototype), 'dispatch', this).call(this, payload);
                if (!_.isUndefined(history)) {
                    this.payloads.splice(this.payloads.length - 1, 1);
                    if (history === History.back) {
                        !_.isUndefined(actionType) ? this.currentPositions[actionType]-- : this.currentPosition--;
                    } else if (history === History.forward) {
                        !_.isUndefined(actionType) ? this.currentPositions[actionType]++ : this.currentPosition++;
                    }
                } else {
                    this.currentPosition = this.payloads.length - 1;
                    this._rearrange(payload);
                }
            }
        }, {
            key: '_rearrange',
            value: function _rearrange(payload) {
                this._groups();
                this._currentPositions(payload);
            }
        }, {
            key: '_groups',
            value: function _groups() {
                var _this2 = this;

                this.groups = {};
                this.payloads.forEach(function (payload) {
                    if (_.isUndefined(_this2.groups[payload.actionType])) {
                        _this2.groups[payload.actionType] = [];
                    }
                    _this2.groups[payload.actionType].push(payload);
                });
            }
        }, {
            key: '_currentPositions',
            value: function _currentPositions(payload) {
                for (var i in this.groups) {
                    if (this.groups.hasOwnProperty(i)) {
                        if (payload.actionType === i) {
                            this.currentPositions[i] = this.groups[i].length - 1;
                        }
                    }
                }
            }
        }, {
            key: 'back',
            value: function back(actionType) {
                var _this3 = this;

                if (!_.isUndefined(actionType)) {
                    if (this._isInvalidType(actionType)) {
                        if (this._hadEverDispatch(actionType)) {
                            this._hasMore(this.currentPositions[actionType] > 0, function () {
                                _this3.dispatch(_this3.groups[actionType][_this3.currentPositions[actionType] - 1], History.back, actionType);
                            });
                        }
                    }
                } else {
                    this._hasMore(this.currentPosition > 0, function () {
                        _this3.dispatch(_this3.payloads[_this3.currentPosition - 1], History.back);
                    });
                }
            }
        }, {
            key: 'forward',
            value: function forward(actionType) {
                var _this4 = this;

                if (!_.isUndefined(actionType)) {
                    if (this._isInvalidType(actionType)) {
                        if (this._hadEverDispatch(actionType)) {
                            this._hasMore(this.currentPositions[actionType] < this.groups[actionType].length - 1, function () {
                                _this4.dispatch(_this4.groups[actionType][_this4.currentPositions[actionType] + 1], History.back, actionType);
                            });
                        }
                    }
                } else {
                    this._hasMore(this.currentPosition < this.payloads.length, function () {
                        _this4.dispatch(_this4.payloads[_this4.currentPosition + 1], History.forward);
                    });
                }
            }
        }, {
            key: '_hasMore',
            value: function _hasMore(more, cb) {
                invariant(more, 'No more payload can dispatch back.');
                if (more) {
                    cb();
                }
            }
        }, {
            key: '_hadEverDispatch',
            value: function _hadEverDispatch(actionType) {
                var valid = !_.isUndefined(this.currentPositions[actionType]);
                invariant(valid, 'You never had dispatch such actionType.');
                return valid;
            }
        }, {
            key: '_isInvalidType',
            value: function _isInvalidType(actionType) {
                var valid = _.isString(actionType);
                invariant(valid, 'Invalid dispatcher actionType.');
                return valid;
            }
        }, {
            key: 'getCurrentPosition',
            value: function getCurrentPosition(actionType) {
                if (!_.isUndefined(actionType)) {
                    if (this._isInvalidType(actionType)) {
                        return this.currentPositions[actionType];
                    }
                    return -1;
                }
                return this.currentPosition;
            }
        }]);

        return _class;
    }(Dispatcher);
};

module.exports = DispatcherHistory;
