'use strict'

const Dispatcher = require('flux-dispatcher-packer')(require('flux').Dispatcher)

const invariant = require('invariant');

const _ = require('lodash')

const History = {
  back: Symbol(),
  forward: Symbol()
}

const DispatcherHistory = Dispatcher => class extends Dispatcher {
    constructor (args) {
        super(args)

        this.payloads = []

        this.currentPosition = 0

        this.currentPositions = {}

        this.groups = {} 
    }

    _invokeCallback (id) {
        super._invokeCallback(id)
        this.payloads.push(this._pendingPayload)
    }

    dispatch (payload, history, actionType) {
        super.dispatch(payload)
        if (!_.isUndefined(history)) {
            this.payloads.splice(this.payloads.length - 1, 1)
            if (history === History.back) {
                !_.isUndefined(actionType)? this.currentPositions[actionType] --: this.currentPosition --
            } else if (history === History.forward) {
                !_.isUndefined(actionType)? this.currentPositions[actionType] ++: this.currentPosition ++
            }
        } else {
            this.currentPosition = this.payloads.length - 1
            this._rearrange(payload)
        }
    }

    _rearrange(payload) {
        this._groups()
        this._currentPositions(payload)
    }

    _groups () {
        this.groups = {}
        this.payloads.forEach((payload) => {
            if (_.isUndefined(this.groups[payload.actionType])) {
                this.groups[payload.actionType] = []
            }
            this.groups[payload.actionType].push(payload)
        })
    }

    _currentPositions (payload) {
        for (let i in this.groups) {
            if (this.groups.hasOwnProperty(i)) {
                if (payload.actionType === i) {
                    this.currentPositions[i] = this.groups[i].length - 1
                }
            }
        }
    }

    back (actionType) {
        if (!_.isUndefined(actionType)) {
            if (this._isInvalidType(actionType)) {
                if (this._hadEverDispatch(actionType)) {
                    this._hasMore(this.currentPositions[actionType] > 0, () => {
                        this.dispatch(this.groups[actionType][this.currentPositions[actionType] - 1], History.back, actionType)
                    })
                }
            }
        } else {
            this._hasMore(this.currentPosition > 0, () => {
                this.dispatch(this.payloads[this.currentPosition - 1], History.back)
            })
        }
    }

    forward (actionType) {
        if (!_.isUndefined(actionType)) {
            if (this._isInvalidType(actionType)) {
                if (this._hadEverDispatch(actionType)) {
                    this._hasMore(this.currentPositions[actionType] < this.groups[actionType].length - 1, () => {
                        this.dispatch(this.groups[actionType][this.currentPositions[actionType] + 1], History.back, actionType)
                    })
                }
            }
        } else {
            this._hasMore(this.currentPosition < this.payloads.length, () => {
                this.dispatch(this.payloads[this.currentPosition + 1], History.forward)
            })
        }
    }

    _hasMore (more, cb) {
        invariant(
          more,
          'No more payload can dispatch back.'
        )
        if (more) {
            cb()
        }
    }

    _hadEverDispatch (actionType) {
        let valid = !_.isUndefined(this.currentPositions[actionType])
        invariant(
          valid,
          'You never had dispatch such actionType.'
        )
        return valid
    }

    _isInvalidType (actionType) {
        let valid = _.isString(actionType)
        invariant(
          valid,
          'Invalid dispatcher actionType.'
        )
        return valid
    }

    getCurrentPosition (actionType) {
        if (!_.isUndefined(actionType)) {
            if (this._isInvalidType(actionType)) {
                return this.currentPositions[actionType]
            }
            return -1
        }
        return this.currentPosition
    }
}

module.exports = DispatcherHistory
