import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import requestAPI from '../api/requestAPI';
import ExpensesTable from './ExpensesTable';
import { prependExpenses, fetchExchanges, isEditingExpense } from '../actions';

class ExpensesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      lastId: 1,
      id: 0,
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
      exchangeRates: {},
    };

    this.populateCurrencies = this.populateCurrencies.bind(this);
    this.currencyinput = this.currencyinput.bind(this);
    this.createInput = this.createInput.bind(this);
    this.methodInput = this.methodInput.bind(this);
    this.tagInput = this.tagInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.initialState = this.initialState.bind(this);
    this.populateExchangeRates = this.populateExchangeRates.bind(this);
    this.createButton = this.createButton.bind(this);
    this.getEditValues = this.getEditValues.bind(this);
  }

  componentDidMount() {
    this.populateCurrencies();
  }

  getEditValues(editId) {
    const { expenses } = this.props;
    const expense = expenses.find((exp) => editId === exp.id);
    const { id, value, description, currency, method, tag, exchangeRates } = expense;
    this.setState({
      id,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates,
    });
    console.log(expense);
  }

  async populateExchangeRates() {
    const { getExchanges } = this.props;
    const rates = await getExchanges()
      .then((res) => res.exchangeRates);
    this.setState({ exchangeRates: rates });
  }

  populateCurrencies() {
    requestAPI().then((result) => {
      const entries = Object.entries(result);
      this.setState({ currencies: entries });
    });
  }

  initialState() {
    this.setState({
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    });
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  createInput(name, labelText, value, type) {
    return (
      <label htmlFor={ `${name}input` }>
        {labelText }
        <input
          type={ type }
          data-testid={ `${name}input` }
          id={ `${name}input` }
          name={ name }
          value={ value }
          onChange={ this.handleChange }
        />
      </label>
    );
  }

  currencyinput() {
    const { currencies } = this.state;
    return (
      <label htmlFor="currency-input">
        Moeda:
        <select
          data-testid="currency-input"
          id="currency-input"
          name="currency"
          onChange={ this.handleChange }
        >
          {
            currencies.map((value) => (
              value[0] === 'USDT'
                ? ''
                : (
                  <option
                    key={ value[0] }
                    value={ value[0] }
                    data-testid={ value[0] }
                  >
                    { value[0] }
                  </option>
                )
            ))
          }
        </select>
      </label>
    );
  }

  methodInput() {
    return (
      <label htmlFor="method-input">
        Método de pagamento:
        <select
          data-testid="method-input"
          id="method-input"
          name="method"
          onChange={ this.handleChange }
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
      </label>
    );
  }

  tagInput() {
    return (
      <label htmlFor="tag-input">
        Tipo da despesa:
        <select
          data-testid="tag-input"
          id="tag-input"
          name="tag"
          onChange={ this.handleChange }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
      </label>
    );
  }

  submitEdit() {
    const { isEditingDispatcher } = this.props;
    isEditingDispatcher(false);
    this.initialState();
  }

  async handleClick() {
    await this.populateExchangeRates();
    const { lastId, id, value, description, currency, method, tag, exchangeRates } = this.state;
    const data = { id, value, description, currency, method, tag, exchangeRates };
    const { expenseDispatcher } = this.props;
    this.setState({ id: lastId, lastId: lastId + 1 });
    expenseDispatcher(data);
    this.initialState();
  }

  createButton(text, onClick) {
    return (
      <button type="button" onClick={ onClick }>
        { text }
      </button>
    );
  }

  render() {
    const { value, description } = this.state;
    const { isEditing } = this.props;
    return (
      <>
        <header>
          <form className="expenses-form">
            <div className="expenses-fields">
              { this.createInput('value', 'Valor:', value, 'number') }
              { this.currencyinput() }
              { this.methodInput() }
              { this.tagInput() }
              { this.createInput(
                'description',
                'Descrição da despesa:',
                description,
                'text',
              )}
            </div>
            {
              isEditing
                ? this.createButton('Editar despesa', this.submitEdit)
                : this.createButton('Adicionar despesa', this.handleClick)
            }
          </form>
        </header>
        <ExpensesTable getValues={ this.getEditValues } />
      </>
    );
  }
}

ExpensesForm.propTypes = {
  expensesDispatcher: PropTypes.func,
  isEditing: PropTypes.bool,
}.isRequired;

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  editData: state.wallet.editData,
  isEditing: state.wallet.isEditing,
});

const mapDispatchToProps = (dispatch) => ({
  getExchanges: (exchange) => dispatch(fetchExchanges(exchange)),
  expenseDispatcher: (expense) => dispatch(prependExpenses(expense)),
  isEditingDispatcher: (payload) => dispatch(isEditingExpense(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesForm);
