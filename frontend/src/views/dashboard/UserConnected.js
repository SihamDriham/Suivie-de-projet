import React, { useState, useEffect } from 'react';
import { Row, Table } from 'react-bootstrap';
import axios from 'axios'; // Assurez-vous d'importer axios

const UserConnected = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token du stockage local
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token comme en-tête d'autorisation
        },
      };
      const response = await axios.get('http://localhost:2023/actif', config);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des statistiques des utilisateurs :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Table responsive hover className="recent-users">
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={`http://localhost:2023/${user.image}`}
                      alt=""
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                  </td>
                  <td>
                    <h6 className="mb-1">
                      {user.cin} 
                    </h6>
                  </td>
                  <td>
                    <h6 className="mb-1">
                      {user.nomU} 
                    </h6>
                  </td>
                  <td>
                    <h6>
                      {user.prenom}
                    </h6>
                  </td>
                  <td>
                    <h6>
                      {user.__t}
                    </h6>
                  </td>
                  {/* <td>
                    <Link to="#" className="label theme-bg2 text-white f-12">
                      Reject
                    </Link>
                    <Link to="#" className="label theme-bg text-white f-12">
                      Approve
                    </Link>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Chargement des utilisateurs...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </React.Fragment>
  );
};

export default UserConnected;
