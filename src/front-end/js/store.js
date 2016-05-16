/* global process.env */
import { createStore, compose, applyMiddleware } from 'redux'
import thunkMdlwr from 'redux-thunk'
import promiseMdlwr from 'redux-promise'
import createLogger from 'redux-logger'

import apiMdlwr from './middleware/apiMdlwr.js'
import createRootReducer from './reducers'
import DevTools from './containers/DevTools'

const enhancer = compose(
  applyMiddleware(
    apiMdlwr,
    thunkMdlwr,
    promiseMdlwr,
    createLogger()
  ),
  DevTools.instrument()
)

export default () => {
  const rootReducer = createRootReducer()
  let AppStore = createStore(rootReducer, enhancer)

  if (process.env.NODE_ENV == 'development') {
    window.AppStore = AppStore
  }

  return AppStore
}
