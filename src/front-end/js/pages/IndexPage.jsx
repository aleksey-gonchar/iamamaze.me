let TopNavbar = require('../components/TopNavbar.jsx')
let HelloWorld = require('../components/HelloWorld.jsx')

export default React.createClass({
  displayName: 'IndexPage',

  render () {
    return (
      <body>
        <TopNavbar/>
        <div className="container-fluid">
          <HelloWorld/>
        </div>
      </body>
    )
  }
})
