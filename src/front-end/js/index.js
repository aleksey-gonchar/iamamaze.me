import 'font-awesome/scss/font-awesome.scss'
import 'index.scss'

import React from 'react'
import { browserHistory } from 'react-router'
import { render } from 'react-dom'
import $ from 'jquery'
// import { syncHistoryWithStore } from 'react-router-redux'

import Root from './containers/Root'
import initStore from './store'
// import initRouter from './router'

const store = initStore()
// const history = syncHistoryWithStore(browserHistory, store)

$(() => {
  render(
    <Root store={store} history={browserHistory} />,
    document.getElementById('root')
  )
})
