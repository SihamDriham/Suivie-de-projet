import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Nouvel état pour le message de succès
  const [imagePreview, setImagePreview] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:2023/user', config);
        setUser(response.data);
        setImagePreview(`http://localhost:2023/${response.data.image}`);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données de l'utilisateur :", error);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { password: newPassword };
      await axios.patch('http://localhost:2023/change-password', body, config);
      setMessage("");
      setSuccessMessage("Mot de passe changé avec succès");
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordInput(false); // Masquer les champs de saisie après la soumission réussie
      fetchUser();
      setTimeout(() => setSuccessMessage(""), 3000); // Masquer le message de succès après 3 secondes
    } catch (error) {
      console.error("Une erreur s'est produite lors de la modification du mot de passe :", error);
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };


  const handleKeyPress = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md="8">
          <Card>
            <Card.Header>
              <h4>Profil utilisateur</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md="4">
                  <div className="text-center position-relative">
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="img-thumbnail"
                      style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                    />
                  </div>
                </Col>
                <Col md="8">
                  <h5>{user.prenom} {user.nomU}</h5>
                  <p>Email: {user.email}</p>
                  <p>Téléphone: {user.telephone}</p>
                  <p>Role: {user.__t === 'UserNormal' ? 'Employe normal' : 'Administrateur'}</p>
                  <p>
                    Mot de passe: {showPassword ? user.password : '********'}
                    <i
                      className="feather icon-eye"
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                      onClick={() => setShowPassword(!showPassword)}
                      onKeyPress={(e) => handleKeyPress(e, () => setShowPassword(!showPassword))}
                      role="button"
                      tabIndex="0"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    />
                    <i
                      className="feather icon-edit-2"
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                      onClick={() => setShowPasswordInput(!showPasswordInput)}
                      onKeyPress={(e) => handleKeyPress(e, () => setShowPasswordInput(!showPasswordInput))}
                      role="button"
                      tabIndex="0"
                      aria-label="Modifier le mot de passe"
                    />
                  </p>
                  {showPasswordInput && (
                    <Form onSubmit={handlePasswordChange}>
                      <Form.Group>
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Confirmer le mot de passe</Form.Label>
                        <Form.Control
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button type="submit" className="mt-3">Changer le mot de passe</Button>
                    </Form>
                  )}
                </Col>
              </Row>
              <hr />
              {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
              {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
