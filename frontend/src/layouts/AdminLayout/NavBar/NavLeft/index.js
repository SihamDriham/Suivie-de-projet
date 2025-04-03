import React from 'react';
import { ListGroup } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

//import useWindowSize from '../../../../hooks/useWindowSize';
//import NavSearch from './NavSearch/index';

const NavLeft = () => {
  //const windowSize = useWindowSize();
  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          {/* <NavSearch windowWidth={windowSize.width} /> */}
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
