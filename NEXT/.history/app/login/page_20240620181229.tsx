'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.push('/collect');
  };

  return (
    <div className={styles.container}>
      <h1>Connexion</h1>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button className={styles.button} onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
