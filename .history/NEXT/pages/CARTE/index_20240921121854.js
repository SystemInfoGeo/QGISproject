import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

const Home = () => {
  const [points, setPoints] = useState([]);
  const [collectedBins, setCollectedBins] = useState([]);

  useEffect(() => {
    const fetchPoints = async () => {
      const response = await fetch('/api/updateStatus');
      const data = await response.json();
      setPoints(data);
    };
    fetchPoints();
  }, []);

  return (
    <div>
      <h1>Optimisation des Collectes</h1>
      <MapComponent points={points} collectedBins={collectedBins} setCollectedBins={setCollectedBins} />
    </div>
  );
};

export default Home;
