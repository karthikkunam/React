import { combineReducers } from 'redux'
import stores from './stores'
import weather from './weather'
import login from './login'
import ordering from './ordering'
import session from './session'
import reporting from './reporting'
import storeFunctions from './storeFunctions'


export default combineReducers({
  stores: stores,
  weather: weather,
  login: login,
  ordering: ordering,
  session: session,
  reporting: reporting, 
  storeFunctions: storeFunctions

})
