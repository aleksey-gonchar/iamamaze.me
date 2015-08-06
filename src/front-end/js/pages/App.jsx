/* global React, Router */
let TopNavbar = require('../components/TopNavbar.jsx')

export default React.createClass({
  displayName: 'AppIndex',

  render () {
    return (
      <body>
        <TopNavbar/>
        <div className='container-fluid'>
          <Router.RouteHandler user={this.state}/>
        </div>
      </body>
    )
  }
})
