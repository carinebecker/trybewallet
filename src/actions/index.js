import apiCurrencies from '../services/APIcurrencies';

export const SAVE_EMAIL = 'SEVE_EMAIL';
export const SAVE_PASSWORD = 'SAVEPASSWORD';
export const CURRENCIES = 'CURRENCIES';
export const REQUEST_CURRENCIES = 'REQUEST_CURRENCIES';
export const REQUEST_CURRENCIES_SUCCESS = 'REQUEST_CURRENCIES_SUCCESS';
export const REQUEST_CURRENCIES_ERROR = 'REQUEST_CURRENCIES_ERROR';
export const SAVE_EXPENSES = 'SAVE_EXPENSES';

export const saveEmail = (email) => ({
  type: SAVE_EMAIL,
  email,
});

export const savePassword = (password) => ({
  type: SAVE_PASSWORD,
  password,
});

export const saveCurrencies = (currencies) => ({
  type: CURRENCIES,
  currencies,
});

export const saveExpenses = (expenses) => ({
  type: SAVE_EXPENSES,
  expenses,
});

// export const requestCurrencies = () => ({
//   type: REQUEST_CURRENCIES,
//   isFetching: true,
// });

export const requestCurrenciesSuccess = (currencies) => ({
  type: REQUEST_CURRENCIES_SUCCESS,
  currencies,
  isFetching: false,
});

// export const requestCurrenciesError = (error) => ({
//   type: REQUEST_CURRENCIES_ERROR,
//   error,
//   isFetching: false,
// });

export const fetchCurrencies = () => (dispatch) => {
  // dispatch(requestCurrencies());
  apiCurrencies()
    .then((currenciesResponse) => dispatch(
      requestCurrenciesSuccess(Object.keys(currenciesResponse)),
    ));
  // .catch((error) => dispatch(
  //   requestCurrenciesError(error),
  // ));
};
