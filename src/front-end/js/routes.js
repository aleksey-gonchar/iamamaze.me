import React from 'react'
import { Route, Redirect } from 'react-router'
import RouterContainer from './containers/RouterContainer'
import $ from 'jquery'

/* containers */
import App from './containers/App.js'

/* partials */
import About from './pages/About.js'
import CV from './pages/CV.js'
import HireMe from './pages/HireMe.js'
import Registration from './pages/Registration.js'
import Login from './pages/Login.js'

function onEnter () { $.notifyClose() }

export default (store) => {
  return (
    <Route path='/app' component={App}>
      <Route path='/login' component={Login} onEnter={onEnter}/>
      <Route path='/registration' component={Registration} onEnter={onEnter}/>
      <Route path='/about' component={About}/>
      <Route path='/cv' component={CV}/>
      <Route path='/hire-me' component={HireMe}/>
    </Route>
  )
}
