export const LOGIN = 'LOGIN';
export const REQ_CURRENCIES = 'REQ_CURRENCIES';
export const GET_CURRENCIES = 'GET_CURRENCIES';
export const NEW_EXPENSE = 'NEW_EXPENSE';
export const ADD_EXPENSE = 'ADD_EXPENSE';

export const loginAction = (email) => ({
  type: LOGIN,
  email,
});

const requestCurrencies = () => ({
  type: REQ_CURRENCIES,
});

const getCurrencis = (currencies) => ({
  type: GET_CURRENCIES,
  currencies,
});

export const fetchCurrencies = () => (
  async (dispatch) => {
    dispatch(requestCurrencies());
    const currenciesFetch = await fetch('https://economia.awesomeapi.com.br/json/all');
    const currenciesJSON = await currenciesFetch.json();
    const currencies = Object.keys(currenciesJSON);
    currencies.splice(1, 1);
    return dispatch(getCurrencis(currencies));
  }
);

const newExpense = () => ({
  type: NEW_EXPENSE,
});

const addExpense = (expense) => ({
  type: ADD_EXPENSE,
  expense,
});

export const addNewExpense = (expense) => (
  async (dispatch) => {
    dispatch(newExpense());
    const exchangeRatesFetch = await fetch('https://economia.awesomeapi.com.br/json/all');
    const exchangeRates = await exchangeRatesFetch.json();
    const newExpenseToAdd = {
      ...expense,
      exchangeRates,
    };
    return dispatch(addExpense(newExpenseToAdd));
  }
);
