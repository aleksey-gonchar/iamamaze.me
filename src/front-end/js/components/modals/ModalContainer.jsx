/* global React */
import SignUpModal from './SignUpModal.jsx'
import ModalStore from '../../stores/ModalStore.js'
import ModalActions from '../../actions/ModalActions.js'

export default React.createClass({
  displayName: 'ModalContainer',
  mixins: [Router.State, Router.Navigation],

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
})