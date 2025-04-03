import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

import PieDonutChart from '../charts/nvd3-chart/chart/PieDonutChart';
import UserTask from './UserTask';
import UserConnected from './UserConnected';
import ProjetStatistiques from './ProjetStatistiques'
import UserStatistiques from './UserStatistiques'

const DashDefault = () => {

  return (
    <React.Fragment>
      <Row>
      <ProjetStatistiques />

        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Projets</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <PieDonutChart />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} >
          <Card className="user-list">
            <Card.Header>
              <Card.Title as="h5">Liste des utilisateurs avec taches</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
            <UserTask />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={8}>
          <Card className="Recent-Users">
            <Card.Header>
              <Card.Title as="h5">Utilisateurs connectés</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <UserConnected />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={4}>
          {/* <Card className="card-event">
            <Card.Body>
              <div className="row align-items-center justify-content-center">
                <div className="col">
                  <h5 className="m-0">Upcoming Event</h5>
                </div>
                <div className="col-auto">
                  <label className="label theme-bg2 text-white f-14 f-w-400 float-end">34%</label>
                </div>
              </div>
              <h2 className="mt-2 f-w-300">
                45<sub className="text-muted f-14">Competitors</sub>
              </h2>
              <h6 className="text-muted mt-3 mb-0">You can participate in event </h6>
              <i className="fa fa-angellist text-c-purple f-50" />
            </Card.Body>
          </Card> */}
          <UserStatistiques />

        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
