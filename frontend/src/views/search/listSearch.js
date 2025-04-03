import React, { useState } from 'react';
import { Form, Button, InputGroup,Col } from 'react-bootstrap';
import axios from 'axios';

const SearchBarToggle = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event) => {

    event.preventDefault(); 
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        window.location.href = '/login';
        return
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };
      const response = await axios.get(`http://localhost:2023/searchList/${searchTerm}`,config);
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      window.location.href = '/tables/listResult';
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    }
  };

  return (
    <div>
      {!showSearch && (
        <Button variant="outline-secondary" size="sm" onClick={handleToggleSearch} style={{ border: 'none' }}>
          <i className="bi bi-search"></i>
        </Button>
      )}
      {showSearch && (
        <Form onSubmit={handleSearch}>
          <Form.Group className="mb-3" as={Col} controlId="formSearchTerm">
            <Form.Control type="text" value={searchTerm} onChange={handleChange} placeholder="Rechercher" style={{ borderRadius: '20px', border: '1px solid white', maxWidth: '150px', background: 'white', paddingRight: '25px' }}  />
          </Form.Group>
          <InputGroup className="mt-2" size="sm">
            
            <Button type="submit" variant="outline-secondary" size="sm" onClick={handleToggleSearch} style={{ position: 'absolute', left: '100px', top: '50%', transform: 'translateY(-170%)', borderRadius: '50%', border: '1px solid white', background: 'white' }}>
              <i className="bi bi-x"></i>
            </Button>
            <Button variant="outline-secondary" type="submit" style={{ position: 'absolute', left: '120px', top: '50%', transform: 'translateY(-140%)', borderRadius: '50%', border: '1px solid white', background: 'white', paddingTop: '11px', paddingBottom: '8px' }}><i className="bi bi-search"></i></Button>
            
          </InputGroup>
        </Form>
      )}
    </div>
  );
};

export default SearchBarToggle;
