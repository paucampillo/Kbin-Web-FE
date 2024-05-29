import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MagazineDetail from './MagazineDetail';
import { getMagazine } from '../../services/api';

const MagazinePage = () => {
  const { magazineId } = useParams(); // Asumiendo que usas React Router para obtener el ID del magazine
  const [magazine, setMagazine] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        const data = await getMagazine(magazineId);
        setMagazine(data);
      } catch (error) {
        setError('Failed to fetch magazine details');
      }
    };

    fetchMagazine();
  }, [magazineId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!magazine) {
    return <p>Loading...</p>;
  }

  return <MagazineDetail magazine={magazine} />;
};

export default MagazinePage;
