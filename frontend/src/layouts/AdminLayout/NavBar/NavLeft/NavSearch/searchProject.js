import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchProjects = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchOnHandler = async () => {
    setIsOpen(true);
    try {
      const response = await axios.get(`http://localhost:2023/searchProject/${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche des projets :', error);
    }
  };

  const searchOffHandler = () => {
    setIsOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  let searchClass = ['main-search'];
  if (isOpen) {
    searchClass = [...searchClass, 'open'];
  }

  return (
    <div id="search-projects" className={searchClass.join(' ')}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="#" className="input-group-append search-close" onClick={searchOffHandler} onKeyDown={(e) => e.key === 'Enter' && searchOffHandler()}>
          <i className="feather icon-x input-group-text" />
        </Link>
        <span
          className="input-group-append search-btn btn btn-primary"
          onClick={searchOnHandler}
          onKeyDown={(e) => e.key === 'Enter' && searchOnHandler()} // Ajout du gestionnaire de clavier
          style={{ borderRadius: '50%', marginLeft: 5 }}
          tabIndex={0} // Assure que l'élément peut recevoir le focus
        >
          <i className="feather icon-search input-group-text" />
        </span>
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Résultats de la recherche :</h4>
          <ul>
            {searchResults.map((result) => (
              <li key={result._id}>
                <Link to={`/projects/${result._id}`}>{result.nomP}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchProjects;
