import Dispatcher from '../dispatcher.js'
import ModalConstants from '../constants/ModalConstants.js'

var Actions = {
  show: (modalName) => {
    Dispatcher.dispatch({
      actionType: ModalConstants.SHOW_MODAL,
      data: modalName
    })
  },

  hide: (modalName) => {
    Dispatcher.dispatch({
      actionType: ModalConstants.HIDE_MODAL,
      data: modalName
    })
  }
}

module.exports = Actions