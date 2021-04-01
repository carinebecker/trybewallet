import { combineReducers } from 'redux';
import { LOGIN, EXPENSE, CURRENCY } from '../actions';

const initialState = {
  user: {
    email: '',
  },
  wallet: {
    currencies: [],
    expenses: [],
  },
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
  case LOGIN:
    return {
      ...state,
      email: action.email,
    };
  default: return state;
  }
};

const walletReducer = (state = initialState.wallet, action) => {
  switch (action.type) {
  case CURRENCY:
    return {
      ...state,
      currencies: action.currencies,
    };
  case EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses.concat(action.expense)],
    };
  default: return state;
  }
};

const rootReducer = combineReducers({ user: userReducer, wallet: walletReducer });

export default rootReducer;
