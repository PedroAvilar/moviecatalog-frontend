import './styles/App.css'
import Header from './components/header/Header.jsx';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/footer/Footer.jsx';
import Home from './pages/Home.jsx';
import Categories from './pages/Categories.jsx';
import Favorites from './pages/favorites/Favorites.jsx';
import About from './pages/about/About.jsx';
import MovieDetails from './pages/movieDetails/MovieDetails.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/register/Register.jsx';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute.jsx';
import MyReviews from './pages/myReviews/MyReviews.jsx';
import Profile from './pages/profile/Profile.jsx';

function App() {

  return (
    <div className='app-layout'>
      <Header />

      <main className='content'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/categorias/:genreId/:genreName' element={<Categories/>}/>
          <Route path='/favoritos' element={<ProtectedRoute> <Favorites/> </ProtectedRoute>} />
          <Route path='/sobre' element={<About/>}/>
          <Route path='/filme/:id/:title?' element={<MovieDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cadastro' element={<Register />} />
          <Route path='/minhas-avaliacoes' element={<ProtectedRoute> <MyReviews /> </ProtectedRoute>} />
          <Route path='/perfil' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;