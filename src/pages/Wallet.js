import '../styles/Wallet.css';
import React from 'react';
import { connect } from 'react-redux';
import { func, string } from 'prop-types';
import { addExpenses, receiveCurrencies } from '../actions';
import getAPI from '../services/currencyAPI';

class FormWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      value: 0,
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    };

    this.fetchAPI = this.fetchAPI.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.inCurrency = this.inCurrency.bind(this);
    this.inHeader = this.inHeader.bind(this);
    this.inMethod = this.inMethod.bind(this);
    this.inTable = this.inTable.bind(this);
    this.inTag = this.inTag.bind(this);
    this.inTh = this.inTh.bind(this);
    this.newInput = this.newInput.bind(this);
    this.newSelect = this.newSelect.bind(this);
    this.totalExpenses = this.totalExpenses.bind(this);
  }

  componentDidMount() {
    this.fetchAPI();
  }

  async fetchAPI() {
    const { getCurrencyDispatch } = this.props;
    const data = await getAPI();
    getCurrencyDispatch(Object.keys(data));
  }

  totalExpenses() {
    const { expenses } = this.props;
    const result = expenses.reduce((prev, curr) => (
      prev + (curr.value * curr.exchangeRates[curr.currency].ask)
    ), 0);
    return (result).toFixed(2);
  }

  inHeader() {
    const { email } = this.props;
    return (
      <header className="header">
        <h1 className="title">TRYBE</h1>
        <p data-testid="email-field">
          { `Email: ${email}` }
        </p>
        <p data-testid="total-field">
          { `Despesa Total: R$ ${this.totalExpenses()}` }
        </p>
        <p data-testid="header-currency-field">BRL</p>
      </header>
    );
  }

  inTable() {
    const { inTh } = this;
    return (
      <table className="table">
        <tr className="th">
          { inTh() }
        </tr>
      </table>
    );
  }

  inTh() {
    const header = [
      'Descrição', 'Tag', 'Método de pagamento', 'Valor', 'Moeda',
      'Câmbio utilizado', 'Valor convertido', 'Moeda de conversão', 'Editar/Excluir',
    ];
    return header.map((element, index) => <th key={ index }>{ element }</th>);
  }

  async handleClick() {
    const { addExpensesDispatcher } = this.props;
    addExpensesDispatcher({ ...this.state, exchangeRates: await getAPI() });
    this.setState((prev) => ({ value: 0, id: prev.id + 1 }));
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  newInput(name, value, data, ...params) {
    const [label, type] = params;
    return (
      <label htmlFor={ name }>
        { label }
        <input
          className={ name }
          data-testid={ data }
          id={ name }
          name={ name }
          onChange={ this.handleChange }
          type={ type }
          value={ value }
        />
      </label>
    );
  }

  inCurrency() {
    const { currencies } = this.props;
    return currencies.map((element, index) => (
      <option
        data-testid={ element }
        value={ element }
        key={ index }
      >
        { element }
      </option>
    ));
  }

  inMethod() {
    const method = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
    return method.map((element, index) => (
      <option value={ element } key={ index }>{ element }</option>
    ));
  }

  inTag() {
    const method = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    return method.map((element, index) => (
      <option value={ element } key={ index }>{ element }</option>
    ));
  }

  newSelect(id, label, name, ...params) {
    const [state, options] = params;
    return (
      <label htmlFor={ id }>
        { `${label} ` }
        <select
          className={ id }
          data-testid={ id }
          name={ name }
          id={ id }
          value={ state }
          onChange={ this.handleChange }
        >
          { options }
        </select>
      </label>
    );
  }

  render() {
    const { description, value, currency, method, tag } = this.state;
    const { newInput, newSelect, inCurrency, inMethod, inTag, handleClick } = this;
    return (
      <div className="body">
        { this.inHeader() }
        <form className="form">
          { newInput('value', value, 'value-input', 'Valor: ', 'number') }
          { newSelect('currency-input', 'Moeda: ', 'currency', currency, inCurrency()) }
          { newSelect('method-input', 'Método de pagamento: ',
            'method', method, inMethod())}
          { newSelect('tag-input', 'Tag: ', 'tag', tag, inTag())}
          { newInput('description', description,
            'description-input', 'Descrição: ', 'text') }
          <button
            className="btn"
            type="button"
            onClick={ () => handleClick() }
          >
            Adicionar despesa
          </button>
        </form>
        { this.inTable() }
      </div>
    );
  }
}

const mapStateToProps = ({ user: { email }, wallet: { currencies, expenses } }) => ({
  currencies,
  email,
  expenses,
});

const mapDispatchToProps = (dispatch) => ({
  addExpensesDispatcher: (data) => dispatch(addExpenses(data)),
  getCurrencyDispatch: (data) => dispatch(receiveCurrencies(data)),
});

FormWallet.propTypes = {
  email: string,
  addExpensesDispatcher: func,
  getCurrencyDispatch: func,
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(FormWallet);
