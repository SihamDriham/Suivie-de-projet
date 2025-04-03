import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ConfigContext } from '../../../../contexts/ConfigContext';
import * as actionType from '../../../../store/actions';

import logo from './ocp.png';

const NavLogo = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const { dispatch } = configContext;

  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass.push('on');
  }

  return (
    <React.Fragment>
      <div className="navbar-brand header-logo" style={{ backgroundColor: '#186a6a' }}>
        <Link to="#" className="b-brand">
        <div className="b-bg" style={{ width: '70px', height: '65px' }}> {/* Taille du conteneur */}
            <img src={logo} alt="OCP Logo" style={{ width: '100%', height: '100%' }} /> {/* Taille de l'image */}
          </div>
          <span className="b-title">OCP</span>
        </Link>
        <Link to="#" className={toggleClass.join(' ')} id="mobile-collapse" onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}>
          <span />
        </Link>
      </div>
    </React.Fragment>
  );
};

export default NavLogo;
