import React, { useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    cin: '',
    nomU: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post('http://localhost:2023/users', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({
        cin: '',
        nomU: '',
        prenom: '',
        email: '',
        password: '',
        telephone: '',
        image: null
      });
      setUserId(response.data._id);
      setShowSpecForm(true);
    } catch (error) {
      if (error.response && error.response.data.field) {
        setErrors({ [error.response.data.field]: error.response.data.message });
      } else {
        console.error('Erreur lors de l\'ajout de l\'utilisateur : ', error);
      }
    }
  };

  const handleSpecSubmit = async (event) => {
    event.preventDefault();
    try {
      if (userType === 'Admin') {
        await handleAdmin(userId);
      } else if (userType === 'Utilisateur normal') {
        await handleNormal(userId);
      } else {
        alert('Veuillez choisir un type d\'utilisateur.');
      }
      window.location.href = '/tables/bootstrap';
    } catch (error) {
      console.error("Une erreur s'est produite lors de la spécification de l'utilisateur :", error);
    }
  };

  const handleAdmin = async (userId) => {
    try {
      await axios.post('http://localhost:2023/convert-to-admin', { userId });
      setShowSpecForm(false);
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de l'admin :", error);
    }
  };

  const handleNormal = async (userId) => {
    try {
      await axios.post('http://localhost:2023/usersNormal', { userId });
      setShowSpecForm(false);
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de l'utilisateur normal :", error);
    }
  };

  const handleChangeUserType = (event) => {
    setUserType(event.target.value);
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter un nouveau utilisateur</Card.Title>
            </Card.Header>
            <Card.Body>
              {!showSpecForm ? (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formCin">
                      <Form.Label>CIN</Form.Label>
                      <Form.Control
                        type="text"
                        name="cin"
                        value={formData.cin}
                        onChange={handleChange}
                        placeholder="CIN"
                        required
                        isInvalid={!!errors.cin}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cin}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formNom">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="nomU"
                        value={formData.nomU}
                        onChange={handleChange}
                        placeholder="Nom"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formPrenom">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder="Prénom"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formTelephone">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        type="text"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="Téléphone"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formPassword">
                      <Form.Label>Mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mot de passe"
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Form.Group className="mb-3" controlId="formImage">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit">Ajouter Utilisateur</Button>
                </Form>
              ) : (
                <Form onSubmit={handleSpecSubmit}>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formGridState">
                      <Form.Label>Type dutilisateur</Form.Label>
                      <Form.Control as="select" value={userType} onChange={handleChangeUserType}>
                        <option value="">Choisir...</option>
                        <option value="Admin">Admin</option>
                        <option value="Utilisateur normal">Utilisateur normal</option>
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  <Button variant="primary" type="submit">Spécifier Utilisateur</Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AddUserForm;
