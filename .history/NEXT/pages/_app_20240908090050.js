// pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS ici


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp;
