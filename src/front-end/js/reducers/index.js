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

  if (__CLIENT__ && !__DEVELOPMENT__) { delete window.INITIAL_STATE }
}
