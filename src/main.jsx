import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const basename = '/moviecatalog-frontend/';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthProvider>
  </BrowserRouter>
);
