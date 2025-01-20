import { combineReducers } from 'redux';
import authReducer from '../Slices/authslice';
import loanReducer from '../Slices/loanSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    loans: loanReducer
});

export default rootReducer;
