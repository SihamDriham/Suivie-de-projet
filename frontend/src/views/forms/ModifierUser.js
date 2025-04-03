import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

const ModifierUser = () => {
  const [nomU, setNomU] = useState('');
  const [prenom, setPrenom] = useState('');
  const [cin, setCin] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:2023/users/${id}`);
      const user = response.data;
      setNomU(user.nomU);
      setPrenom(user.prenom);
      setCin(user.cin);
      setEmail(user.email);
      setTelephone(user.telephone);
      setPassword(user.password);
      setUserType(user.__t);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données de l'utilisateur :", error);
    }
  };

  const handleChangeNomU = (event) => {
    setNomU(event.target.value);
  };

  const handleChangePrenom = (event) => {
    setPrenom(event.target.value);
  };

  const handleChangeCin = (event) => {
    setCin(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeTelephone= (event) => {
    setTelephone(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); 

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('cin', cin);
      formData.append('nomU', nomU);
      formData.append('prenom', prenom);
      formData.append('email', email);
      formData.append('telephone', telephone);
      formData.append('password', password);

      await axios.put(`http://localhost:2023/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Réinitialiser les états après soumission réussie
      setNomU('');
      setPrenom('');
      setCin('');
      setEmail('');
      setTelephone('');
      setPassword('');
      setImage(null);
      setUserType('');
      try {
        if (userType === 'Admin') {
          await handleAdmin(id);
        } else if (userType === 'UserNormal') {
          await handleNormal(id);
        } else {
          alert('Veuillez choisir un type d\'utilisateur.');
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la spécification de l'utilisateur :", error);
      }
      window.location.href = '/tables/bootstrap';
    } catch (error) {
      if (error.response && error.response.data.message === 'CIN déjà utilisé') {
        setError('CIN déjà utilisé');
      } else {
        console.error("Une erreur s'est produite lors de la modification de l'utilisateur :", error);
      }
    }
  };

  const handleAdmin = async (id) => {
    try {
      await axios.post('http://localhost:2023/convert-to-admin',{userId:id});
      setShowSpecForm(false); 
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de l'admin :", error);
    }
  };

  const handleNormal = async (id) => {
    try {
      await axios.post('http://localhost:2023/usersNormal',{userId:id});
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
              <Card.Title as="h5">Modifier lutilisateur</Card.Title>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formCin">
                    <Form.Label>CIN</Form.Label>
                    <Form.Control
                      type="text"
                      name="cin"
                      value={cin}
                      onChange={handleChangeCin}
                      isInvalid={!!error}
                    />
                    <Form.Control.Feedback type="invalid">
                      {error}
                    </Form.Control.Feedback>
                  </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formNom">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control type="text" name="nomU" value={nomU} onChange={handleChangeNomU} />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formPrenom">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control type="text" name="prenom" value={prenom} onChange={handleChangePrenom} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formPrenom">
                      <Form.Label>Telephone</Form.Label>
                      <Form.Control type="text" name="telephone" value={telephone} onChange={handleChangeTelephone} />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" value={email} onChange={handleChangeEmail} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formPassword">
                      <Form.Label>Mot de passe</Form.Label>
                      <Form.Control type="password" name="password" value={password} onChange={handleChangePassword} />
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formImage">
                      <Form.Label>Photo</Form.Label>
                      <Form.Control type="file" name="image" onChange={handleImageChange} />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formGridState">
                      <Form.Label>Type dutilisateur</Form.Label>
                      <Form.Control as="select" name="userType" value={userType} onChange={handleChangeUserType}>
                        <option value="">Choisir...</option>
                        <option value="Admin" selected={userType === "Admin"}>Admin</option>
                        <option value="UserNormal" selected={userType === "UserNormal"}>Utilisateur normal</option>
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  <Button variant="primary" type="submit">Modifier Utilisateur</Button>
                </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ModifierUser;
