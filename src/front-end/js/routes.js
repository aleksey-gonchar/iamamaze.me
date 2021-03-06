import React from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'
import RouterContainer from './containers/RouterContainer'
import $ from 'jquery'

/* containers */
import App from './containers/App.js'

/* partials */
import About from './pages/About.js'
import CV from './pages/CV.js'

export default (
  <Route path='/app' component={App}>
    <Route path='about' component={About}/>
    <Route path='cv' component={CV}/>
  </Route>
)

// <IndexRoute component={About}/>
// <Route path='/login' component={Login} onEnter={onEnter}/>
// <Route path='/registration' component={Registration} onEnter={onEnter}/>

