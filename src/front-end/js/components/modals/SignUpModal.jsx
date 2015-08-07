/* global React */
let { Modal, Button } = RB
let { Header, Body, Title, Footer } = Modal

import React from 'react/addons'

export default React.createClass({
  displayName: 'SingUpModal',
  mixins: [
    React.addons.LinkedStateMixin,
    Router.Navigation,
    Router.State
  ],

  getInitialState () {
    return { showModal: false }
  },

  close () {
    this.setState({ showModal: false })
  },

  open () {
    this.setState({ showModal: true })
  },

  render () {
    return (
      <Modal show={this.state.showModal} onHide={this.close}>
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
})