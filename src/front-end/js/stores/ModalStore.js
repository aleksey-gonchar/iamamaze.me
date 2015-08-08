import Dispatcher from '../dispatcher.js'
import ModalConstants from '../constants/ModalConstants.js'
import _ from 'lodash'
import {EventEmitter} from 'events'
import Immutable from 'immutable'

const CHANGE_EVENT = 'change-modal'

var modals = Immutable.fromJS({
  'login': { isOpen : false },
  'sign-up': { isOpen : false }
})


var Store = _.assign({ state: modals }, EventEmitter.prototype, {
  emitChange () {
    this.emit(CHANGE_EVENT)
  },

  addChangeListener (cb) {
    this.on(CHANGE_EVENT, cb)
  },

  removeChangeListener (cb) {
    this.removeListener(CHANGE_EVENT, cb)
  },

  getState () {
    return this.state;
  },

  show (modalName) {
    this.state = this.state.setIn([modalName, 'isOpen'], true)
    this.emitChange()
  },

  hide (modalName) {
    this.state = this.state.setIn([modalName, 'isOpen'], false)
    this.emitChange()
  }
})

Dispatcher.register( (action) => {
  switch(action.actionType) {
    case ModalConstants.SHOW_MODAL:
      // TODO: hide any other visible
      Store.show(action.name)
      break
    case ModalConstants.HIDE_MODAL:
      Store.hide(action.name)
      break
    default:
      // no op
  }
})

export default Store