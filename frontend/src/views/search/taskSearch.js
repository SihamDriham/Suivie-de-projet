import React, { useState } from 'react';
import { Form, Button, InputGroup,Col } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SearchBarToggle = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { projetId, phaseId } = useParams();

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event) => {

    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    try {
      const response = await axios.get(`http://localhost:2023/searchTask/${searchTerm}/${phaseId}/${projetId}`);
      // Stocker les résultats de recherche dans localStorage
      localStorage.setItem('searchResults', JSON.stringify(response.data));
      // Rediriger vers la page des résultats
      window.location.href = `/tables/taskResult/${phaseId}/${projetId}`;
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
            {/* <FormControl
              type="search"
              placeholder="Rechercher"
              aria-label="Search"
              size="sm"
              value={searchTerm}
              onChange={handleChange}
              style={{ borderRadius: '20px', border: '1px solid white', maxWidth: '150px', background: 'white', paddingRight: '25px' }} 
            /> */}
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
