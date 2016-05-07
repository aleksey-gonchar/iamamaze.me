import { combineReducers } from 'redux'
import createAppReducer from './AppReducer'
import createCVReducer from './CVReducer'
import modals from './ModalsReducer'

export default () => {
  return combineReducers({
    application: createAppReducer(),
    cv: createCVReducer(),
    modals
  })

  if (process.env.NODE_ENV !== 'development') { delete window.INITIAL_STATE }
}
