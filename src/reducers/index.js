// import user from './user';
// import wallet from './wallet';
import { LOGIN } from '../actions';

// Configure os seus reducers.
// ATENÇÃO: você obrigatoriamente tem que utilizar as chaves "user" e "wallet" no seu estado global

const INITIAL_STATE = {
  user: {
    email: '',
  },
  wallet: {
    currencies: [],
    expenses: [],
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case LOGIN:
    return ({
      ...state,
      user: { email: action.email },
    });
  default:
    return state;
  }
};

export default reducer;
