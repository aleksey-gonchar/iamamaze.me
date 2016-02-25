import 'font-awesome/scss/font-awesome.scss'
import 'index.scss'

import { React, browserHistory } from 'react'
//import Location from 'react-router/lib/Location'
//import qs from 'qs'
import $ from 'jquery'

import initStore from './store.js'
import initRouter from './router.js'

//const history = new BrowserHistory()
//const search = document.location.search
//const query = search && qs.parse(search)
//const location = new Location(document.location.pathname, query)
const location = null
$(() => {
  const store = initStore()
  initRouter(browserHistory, store)
    .then(({content}) => {
      React.render(content, document.body)
    })
})
