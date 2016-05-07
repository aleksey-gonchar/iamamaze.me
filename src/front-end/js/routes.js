import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'
import RouterContainer from './containers/RouterContainer'
import $ from 'jquery'

/* containers */
import App from './containers/App.js'

/* partials */
import About from './pages/About.js'
import CV from './pages/CV.js'
import Registration from './pages/Registration.js'
import Login from './pages/Login.js'

function onEnter () { $.notifyClose() }

class About1 extends React.Component {
  render () {
    return (
      <div>about1</div>
    )
  }
}
//
// export default (
//   <Route path='/app' component={App}>
//     <Route path='about' component={About1}/>
//   </Route>
// )
export default (
  <Route path='/app' component={App}>
    <Route path='about' component={About}/>
    <Route path='cv' component={CV}/>
  </Route>
)

// <IndexRoute component={About}/>
// <Route path='/login' component={Login} onEnter={onEnter}/>
// <Route path='/registration' component={Registration} onEnter={onEnter}/>

