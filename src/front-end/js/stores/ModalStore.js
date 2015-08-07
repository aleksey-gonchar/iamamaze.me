import Dispatcher from '../dispatcher.js'
import ModalConstants from '../constants/ModalConstants.js'
import _ from 'lodash'
var EventEmitter = require('events').EventEmitter

const CHANGE_EVENT = 'change-modal'

var Store = _.assign({}, EventEmitter.prototype, {
  emitChange: () => {
    this.emit(CHANGE_EVENT)
  },

  addChangeListener: (cb) => {
    this.on(CHANGE_EVENT, cb)
  },

  removeChangeListener: (cb) => {
    this.removeListener(CHANGE_EVENT, cb)
  }

})

Dispatcher.register( (action) => {
  switch(action.actionType) {
    case ModalConstants.SHOW_MODAL:
      Store.emitChange()
      break
  }
})

module.exports = Store