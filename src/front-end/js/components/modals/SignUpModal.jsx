import Component from '../Component.jsx'
import ModalActions from '../../actions/ModalActions.js'
import ModalStore from '../../stores/ModalStore.js'

let { Modal, Button } = RB
let { Header, Body, Title, Footer } = Modal

class SignUpModal extends Component{
  constructor(props) {
    super(props)
    this.state = ModalStore.getState().get('sign-up')
  }

  close () {
    this.props.actions.close('sign-up')
  }

  render () {
    return (
      <Modal show={this.state.isOpen} onHide={this.close}>
        <Header closeButton>
          <Title>Sign up</Title>
        </Header>
        <Body>
          <h4>Text in a modal</h4>
          <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
        </Body>
        <Footer>
          <Button onClick={this.close}>Close</Button>
        </Footer>
      </Modal>
    )
  }
}

SignUpModal.propsTypes = {
  actions : React.PropTypes.object.isRequired
}

SignUpModal.defaulsProps = {
  actions: ModalActions
}

export default SignUpModal