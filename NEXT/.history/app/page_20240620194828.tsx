''

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <h1>Accueil</h1>
      <button className={styles.button} onClick={navigateToLogin}>S'identifier</button>
    </div>
  );
}
