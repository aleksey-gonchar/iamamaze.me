/* global React */
import Component from '../Component.jsx'
import SignUpModal from './SignUpModal.jsx'
import ModalStore from '../../stores/ModalStore.js'
import ModalActions from '../../actions/ModalActions.js'

class ModalContainer extends Component {
  constructor(props) {
    super(props)
    this.state = ModalStore.getState()
  }

  getChildContext () {
    return {
      actions : {
        show () { console.log('show()') },
        hide () { console.log('hide()') }
      }
    }
  }

  render () {
    let modal = (
      <SignUpModal />
    )

    return (
      <div id='modal-container'>
        {modal}
      </div>
    )
  }
}

ModalContainer.childContextTypes = {
  actions : React.PropTypes.object.isRequired
}

ModalContainer.propTypes = {
  actions: React.PropTypes.object.isRequired
}

ModalContainer.defaultProps = {
  actions : ModalActions
}

export default ModalContainer