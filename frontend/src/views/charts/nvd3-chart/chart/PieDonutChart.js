import React, { useState, useEffect } from 'react';
import NVD3Chart from 'react-nvd3';
import axios from 'axios';

const PieDonutChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const keys = ['À faire', 'En cours', 'En attente', 'Terminé'];
      const colors = {
        'À faire': '#ff8a65',
        'En cours': '#f4c22b',
        'En attente': '#04a9f5',
        'Terminé': '#a389d4'
      };
      const newData = [];

      for (const key of keys) {
        try {
          // Appel à votre API pour récupérer les données de comptage pour chaque état
          const response = await axios.post('http://localhost:2023/projetStatut', { etat: key });
          const countData = response.data; // Supposons que votre backend renvoie un objet avec la clé "count"
          
          // Mettre à jour les données du graphique avec les données récupérées
          newData.push({
            key: key,
            y: countData.count,
            color: colors[key] // Utilisation de la couleur correspondante pour chaque état
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des données pour', key, ':', error);
        }
      }

      setData(newData);
    };

    fetchData();
  }, []); // Assurez-vous de passer les dépendances vides pour que cet effet ne s'exécute qu'une seule fois

  return (
    <NVD3Chart
      id="chart"
      height={300}
      type="pieChart"
      datum={data}
      x="key"
      y="y"
      donut
      labelType="percent"
    />
  );
};

export default PieDonutChart;
