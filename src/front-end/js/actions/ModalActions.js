import Dispatcher from '../dispatcher.js'
import ModalConstants from '../constants/ModalConstants.js'

var Actions = {
  show: (modalName) => {
    Dispatcher.dispatch({
      actionType: ModalConstants.SHOW_MODAL,
      name: modalName
    })
  },

  hide: (modalName) => {
    Dispatcher.dispatch({
      actionType: ModalConstants.HIDE_MODAL,
      name: modalName
    })
  }
}

export default Actions