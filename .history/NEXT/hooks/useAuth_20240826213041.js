import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
  
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return authenticated;
};

export default useAuth;
