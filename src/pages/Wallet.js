import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { addExpense, delExpense, editExpense, setEditExpense, updateCurrencies }
  from '../actions';
import fetchCurrencies from '../service/apiCoin';
import Table from '../components/Table';
import '../App.css';
import '../CSS/wallet.css';

class Wallet extends React.Component {
  constructor() {
    super();
    this.fetchApi = this.fetchApi.bind(this);
    this.walletHeader = this.walletHeader.bind(this);
    this.spendingValue = this.spendingValue.bind(this);
    this.spendingDescription = this.spendingDescription.bind(this);
    this.spendingCurrency = this.spendingCurrency.bind(this);
    this.spendingMethod = this.spendingMethod.bind(this);
    this.spendingCategory = this.spendingCategory.bind(this);
    this.totalSpending = this.totalSpending.bind(this);
    this.addOrEdit = this.addOrEdit.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      id: 0, currency: 'USD', value: 0, description: '', method: '', tag: '' };
  }

  componentDidMount() {
    this.fetchApi();
  }

  async fetchApi() {
    const { propUpdateCurrencies } = this.props;
    const data = await fetchCurrencies();
    propUpdateCurrencies(Object.keys(data));
  }

  totalSpending() {
    const { expenses } = this.props;
    const total = expenses.reduce((acc, curr) => (
      acc + (parseFloat(curr.value)
        * parseFloat(curr.exchangeRates[curr.currency].ask))), 0);
    return total.toFixed(2);
  }

  walletHeader() {
    const { email } = this.props;
    return (
      <header className="App-header">
        <span data-testid="email-field">
          {email}
        </span>
        <span data-testid="total-field">
          {`gastos: $ ${this.totalSpending()}`}
        </span>
        <span data-testid="header-currency-field">
          moeda: BRL
        </span>
      </header>
    );
  }

  spendingValue() {
    const { value } = this.state;
    return (
      <label htmlFor="value">
        Valor da despesa:
        <input
          data-testid="value-input"
          name="value"
          value={ value }
          type="number"
          step="1.00"
          min="0"
          onChange={ ({ target }) => {
            this.setState({ value: target.value });
          } }
        />
      </label>
    );
  }

  spendingDescription() {
    return (
      <label htmlFor="description">
        Descrição:
        <input
          data-testid="description-input"
          name="description"
          type="text"
          onChange={ ({ target: { value } }) => {
            this.setState({ description: value });
          } }
        />
      </label>
    );
  }

  spendingCurrency() {
    const { currencies } = this.props;
    return (
      <label htmlFor="currency">
        Moeda:
        <select
          data-testid="currency-input"
          id="currency"
          onChange={ ({ target: { value } }) => {
            this.setState({ currency: value });
          } }
        >
          {currencies
            .map((curr) => (curr !== 'USDT'
              ? <option data-testid={ curr } key={ curr } value={ curr }>{curr}</option>
              : null))}
        </select>
      </label>
    );
  }

  spendingMethod() {
    return (
      <label htmlFor="method">
        Forma de pagamento:
        <select
          data-testid="method-input"
          id="method"
          onChange={ ({ target: { value } }) => {
            this.setState({ method: value });
          } }
        >
          <option defaultValue hidden>Escolha</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
      </label>
    );
  }

  spendingCategory() {
    return (
      <label htmlFor="tag">
        Categoria da despesa:
        <select
          data-testid="tag-input"
          id="tag"
          onChange={ ({ target: { value } }) => {
            this.setState({ tag: value });
          } }
        >
          <option defaultValue hidden>Escolha</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
      </label>
    );
  }

  async submit() {
    const {
      propAddExpense, propEditExpense, propSetEditExpense, status, id, expenses,
    } = this.props;
    if (status) {
      const { exchangeRates } = expenses.find((expense) => expense.id === id);
      const editExp = { ...this.state, id, exchangeRates };
      propSetEditExpense(editExp);
      propEditExpense(false, '');
    } else {
      propAddExpense({ ...this.state, exchangeRates: await fetchCurrencies() });
      this.setState((prev) => ({ value: 0, id: prev.id + 1 }));
    }
  }

  addOrEdit() {
    const { status } = this.props;
    if (status) {
      return (
        <button data-testid="edit-btn" type="button" onClick={ this.submit }>
          Editar despesa
        </button>
      );
    } return (
      <button type="button" onClick={ this.submit }>
        Adicionar despesa
      </button>
    );
  }

  render() {
    const { currencies, expenses } = this.props;
    return (
      <div>
        { this.walletHeader() }
        <form className="add-expenses input-space">
          { this.spendingValue() }
          { this.spendingDescription() }
          { currencies && this.spendingCurrency() }
          { this.spendingMethod() }
          { this.spendingCategory() }
          { this.addOrEdit() }
        </form>
        <Table expenses={ expenses } />
      </div>
    );
  }
}

const mapStateToProps = ({
  user: { email }, wallet: { currencies, expenses, edit: { status, id } = {} },
}) => ({ email, currencies, expenses, status, id });

const mapDispatchToProps = (dispatch) => ({
  propAddExpense: (data) => dispatch(addExpense(data)),
  propDelExpense: (data) => dispatch(delExpense(data)),
  propSetEditExpense: (data) => dispatch(setEditExpense(data)),
  propUpdateCurrencies: (data) => dispatch(updateCurrencies(data)),
  propEditExpense: (status, id) => dispatch(editExpense(status, id)),
});

Wallet.propTypes = {
  email: Proptypes.string,
  propUpdateCurrencies: Proptypes.func,
  propAddExpense: Proptypes.func,
  propDelExpense: Proptypes.func,
  propEditExpense: Proptypes.func,
  propSetEditExpense: Proptypes.func,
  currencies: Proptypes.arrayOf(Proptypes.object),
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
