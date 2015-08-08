/* global React, Router */
require('./vendor-config')

window.React = require('react/addons')
window.Router = require('react-router')
window.RB = require('react-bootstrap')
window.RRB = require('react-router-bootstrap')

let {Route, DefaultRoute} = Router

let App = require('./pages/App.jsx')

/* partials */
let Dashboard = require('./partials/Dashboard.jsx')
let Login = require('./partials/Login.jsx')
let SignUp = require('./partials/SignUp.jsx')
let Private = require('./partials/Private.jsx')
let Public = require('./partials/Public.jsx')

$(() => {
  $(':checkbox').labelauty()

  let routes = (
    <Route name='app' path='/' handler={App} >
      <Route name='sign-up' handler={SignUp}/>
      <Route name='login' handler={Login}/>
      <Route name='dashboard' handler={Dashboard}/>
      <Route name='public' handler={Public}/>
      <Route name='private' handler={Private}/>
      <DefaultRoute handler={Dashboard} />
    </Route>
  )

  Router.run(routes, (Handler) => {
    React.render(<Handler/>, document.body)
  })
})

