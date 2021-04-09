import {
  REQUEST_CURRENCIES_SUCCESS, SAVE_EXPENSES, CURRENCIES,
} from '../actions';

const INITIAL_STATE_WALLET = {
  currencies: [],
  expenses: [],
};

const walletReducer = (state = INITIAL_STATE_WALLET, action) => {
  switch (action.type) {
  case CURRENCIES:
    return {
      ...state, currencies: Object.keys(action.currencies),
    };

  case SAVE_EXPENSES:
    return {
      ...state, expenses: [...state.expenses, action.expenses],
    };

  case REQUEST_CURRENCIES_SUCCESS:
    return {
      ...state,
      currencies: action.currencies,
      isFetching: action.isFetching,
    };
  default:
    return state;
  }
};

export default walletReducer;
