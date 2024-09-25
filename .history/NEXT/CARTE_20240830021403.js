import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Carte = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      fetch('/api/protected-map', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      });
    }
  }, [router]);

  return (
    <div>
      <h1>Carte Géographique</h1>
      <p>Votre carte sera ici</p>
    </div>
  );
};

export default Carte;
