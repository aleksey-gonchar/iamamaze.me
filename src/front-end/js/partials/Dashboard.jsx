/* global React */
let HelloWorld = require('../components/HelloWorld.jsx')

export default React.createClass({
  displayName: 'Dashboard',

  render () {
    return (
      <HelloWorld/>
    )
  }
})
