import React, { useEffect, useState } from 'react';
import { getMagazines } from '../../services/api';

const MagazineList = () => {
  const [magazines, setMagazines] = useState([]);

  useEffect(() => {
    const fetchMagazines = async () => {
      const data = await getMagazines();
      setMagazines(data);
    };

    fetchMagazines();
  }, []);

  return (
    <div>
      <h2>Magazines</h2>
      <ul>
        {magazines.map(magazine => (
          <li key={magazine.id}>{magazine.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MagazineList;
