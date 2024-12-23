import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext'; // Adjust the path if necessary
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/home.css'; // Ensure your custom styles are imported after Bootstrap

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Conditionally import Bootstrap JavaScript only on the client side
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js').catch(error => console.error('Error loading Bootstrap JS:', error));
    }
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default MyApp;