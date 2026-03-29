import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import App from './App.jsx'
import './styles/index.css'

const basename = '/moviecatalog-frontend/';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
);
