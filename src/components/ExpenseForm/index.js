import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Inputs from './Inputs';
import SelectOptions from './Select/SelectOptions';
import HandleSelect from './Select/HandleSelect';
import ButtonAdd from './ButtonAdd';

class expenseForm extends React.Component {
  render() {
    const payWith = [
      'Dinheiro',
      'Cartão de crédito',
      'Cartão de débito',
    ];
    const tags = [
      'Alimentação',
      'Lazer',
      'Trabalho',
      'Transporte',
      'Saúde',
    ];
    const { expenseDetails: { value = '', description = '' } = {} } = this.props;
    // const { value, description } = expenseDetails;
    // console.log(expenseDetails);
    // console.log(!value, !description);
    return (
      <div>
        <Inputs
          value={ value }
          name="value"
          dataTestid="value-input"
          // state={ { value: '' } }
        />
        <Inputs
          value={ description }
          name="description"
          dataTestid="description-input"
          // state={ { description: '' } }
        />
        <SelectOptions />
        <HandleSelect
          title="Forma de pagamento"
          dataTestid="method-input"
          name="method"
          id="Metodo"
          array={ payWith }
        />
        <HandleSelect
          title="Tag"
          dataTestid="tag-input"
          name="tag"
          array={ tags }
          id="idTag"
        />
        <ButtonAdd title="Adicionar despesa" />
      </div>
    );
  }
}

expenseForm.propTypes = {
  value: PropTypes.string,
  description: PropTypes.string,
}.isRequired;

const mapStateToProps = ({ wallet: { expenseDetails } }) => ({
  expenseDetails,
});

export default connect(mapStateToProps)(expenseForm);
