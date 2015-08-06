/* global React */
import TopNavbar from '../components/TopNavbar.jsx'

let { RouteHandler } = Router

export default React.createClass({
  displayName: 'AppIndex',

  render () {
    return (
      <div id='app'>
        <TopNavbar/>
        <div className='container-fluid'>
          <RouteHandler/>
        </div>
      </div>
    )
  }
})
