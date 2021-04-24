import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { MdMonetizationOn } from 'react-icons/md';

import './Header.css';

class Header extends React.Component {
  render() {
    const { email, wallet } = this.props;
    return (
      <header className="header">
        <MdMonetizationOn size={ 50 } />
        <div className="user">
          <div>
            Email:
            <span data-testid="email-field">{ email }</span>
          </div>
          <div>
            Dispesa Total:
            <span data-testid="total-field">R$ 0,00</span>
            {/* <span data-testid="total-field">{ `R$ ${wallet.expenses.value}` }</span> */}
            <span data-testid="header-currency-field">BRL</span>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  wallet: state.wallet,
  email: state.user.email,
});

/* Header.propTypes = {
  wallet: PropTypes.shape({
    optionalProperty: PropTypes.arrayOf(),
    requiredProperty: PropTypes.number.isRequired
  }),
  email: PropTypes.string,
}; */

// export default Header;
export default connect(mapStateToProps)(Header);
