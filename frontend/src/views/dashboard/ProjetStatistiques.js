import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios'; // Assurez-vous d'importer axios

const ProjetStatistiques = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2023/budget');
        const countData = response.data;
        const newData = [{
          amount: countData.total,
        }];
        setData(newData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }

    const fetchData2 = async () => {
      try {
        const response2 = await axios.get('http://localhost:2023/budget2');
        const countData2 = response2.data;
        const newData2 = [{
          amount: countData2.total,
        }];
        setData2(newData2);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    }

    fetchData();
    fetchData2();
  }, []);

  const dashSalesData = [
    { title: 'Budget total des projets', amount: data[0]?.amount || '0.00', icon: 'icon-arrow-up text-c-green' },
  ];

  const dashSalesData2 = [
    { title: 'Budget total des projets en cours', amount: data2[0]?.amount || '0.00', icon: 'icon-arrow-up text-c-green' },
  ];

  return (
    <React.Fragment>
      <Row>
        {dashSalesData.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount} DH
                      </h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        {dashSalesData2.map((data, index) => {
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card>
                <Card.Body>
                  <h6 className="mb-4">{data.title}</h6>
                  <div className="row d-flex align-items-center">
                    <div className="col-9">
                      <h3 className="f-w-300 d-flex align-items-center m-b-0">
                        <i className={`feather ${data.icon} f-30 m-r-5`} /> {data.amount} DH
                      </h3>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </React.Fragment>
  );
};

export default ProjetStatistiques;
