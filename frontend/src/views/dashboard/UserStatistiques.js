import React, {useState, useEffect} from 'react';
import { Row, Card } from 'react-bootstrap';
import axios from 'axios'

const UserStatistiques = () => {
 const [users, setUsers] = useState('');
 const [admins, setAdmins] = useState('');

 useEffect(() => {
   fetchUsers();
   fetchAdmins();
 }, []);

 const fetchUsers = async () => {
   try {
     const response = await axios.get('http://localhost:2023/nombreUser');
     setUsers(response.data.count)
   } catch (error) {
     console.error("Une erreur s'est produite lors de la récupération des statistiques des utilisateurs :", error);
   }
 };

 const fetchAdmins = async () => {
  try {
    const response = await axios.get('http://localhost:2023/nombreAdmin');
    setAdmins(response.data.count)
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des statistiques des utilisateurs :", error);
  }
 };

  return (
    <React.Fragment>
      <Row>
          <Card>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-zap f-30 text-c-green" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{users}</h3>
                  <span className="d-block text-uppercase">Nombre des utilisateurs normales</span>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  <i className="feather icon-map-pin f-30 text-c-blue" />
                </div>
                <div className="col">
                  <h3 className="f-w-300">{admins}</h3>
                  <span className="d-block text-uppercase">Nombre des administrateurs</span>
                </div>
              </div>
            </Card.Body>
          </Card>
      </Row>
    </React.Fragment>
  );
};

export default UserStatistiques;
