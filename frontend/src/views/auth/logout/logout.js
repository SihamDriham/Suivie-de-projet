import React, { useEffect } from 'react';
import axios from 'axios';

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post('http://localhost:2023/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }
      localStorage.removeItem('token');
      window.location.href = '/login'; // Rediriger vers la page de connexion
    };

    logout();
  }, []);

  return (
    <div>
      Déconnexion en cours...
    </div>
  );
};

export default Logout;
