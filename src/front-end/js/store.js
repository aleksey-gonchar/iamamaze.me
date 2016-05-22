/* global process.env */
import { createStore, compose, applyMiddleware } from 'redux'
import thunkMdlwr from 'redux-thunk'
import promiseMdlwr from 'redux-promise'
import createLogger from 'redux-logger'

import apiMdlwr from './middleware/apiMdlwr.js'
import createRootReducer from './reducers'
import DevTools from './containers/DevTools'

let mdlwr
let enhancer

if (process.env.NODE_ENV == 'development') {
  mdlwr = applyMiddleware(
    apiMdlwr,
    thunkMdlwr,
    promiseMdlwr,
    createLogger()
  )

  enhancer = compose(mdlwr, DevTools.instrument())
} else {
  mdlwr = applyMiddleware(
    apiMdlwr,
    thunkMdlwr,
    promiseMdlwr
  )

  enhancer = mdlwr
}

export default () => {
  const rootReducer = createRootReducer()
  let AppStore = createStore(rootReducer, enhancer)

  if (process.env.NODE_ENV == 'development') {
    window.AppStore = AppStore
  }

  return AppStore
}
