import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';

import axios from 'axios'; // Importer axios pour effectuer des requêtes HTTP
import * as Yup from 'yup';
import { Formik } from 'formik';

const FirebaseLogin = ({ className, ...rest }) => {
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:2023/login', {
        email: values.email,
        password: values.password
      });
      if (response.data.message === 'Login successful') {
        window.location.href = '/app/dashboard/default';
      } else {
        console.log('non');
      }
      setSuccessMessage('Connexion réussie !');
  
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la connexion :", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Doit être un e-mail valide').max(255).required('Email requis'),
          password: Yup.string().max(255).required('Mot de passe requis').min(8, 'Entrer minimum 8 caractères')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} className={className} {...rest}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                label="email"
                name="email"
                placeholder="Adresse email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              />
              {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                label="password"
                name="password"
                placeholder="Mot de passe"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
            </div>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Row>
              <Col style={{ marginTop: 2 }}>
                <Button className="btn-block" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                  {isSubmitting ? 'Chargement...' : 'Connexion'}
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>

      <hr />
    </React.Fragment>
  );
};

FirebaseLogin.propTypes = {
  className: PropTypes.string // Définir le type de la propriété className
};

export default FirebaseLogin;
