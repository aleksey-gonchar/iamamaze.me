/* global React, Router */
import Component from '../components/Component.jsx'
import TopNavbar from '../components/TopNavbar.jsx'
import ModalContainer from '../components/modals/ModalContainer.jsx'

let { RouteHandler } = Router

class App extends Component {
  render () {
    return (
      <div id='app'>
        <TopNavbar/>
        <div className='container-fluid'>
          <RouteHandler/>
        </div>
        <ModalContainer />
      </div>
    )
  }
}

export default App