import {createStore, combineReducers} from 'redux'
import Mode from './mode/mode'
export default createStore(
    combineReducers({
        mode: Mode
    })
)
