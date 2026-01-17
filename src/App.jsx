import './styles/App.css'
import Header from './components/header/Header.jsx';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/footer/Footer.jsx';
import Home from './pages/Home.jsx';
import Categories from './pages/Categories.jsx';
import Favorites from './pages/favorites/Favorites.jsx';
import About from './pages/About.jsx';
import MovieDetails from './pages/movieDetails/MovieDetails.jsx';

function App() {

  return (
    <div className='app-layout'>
      <Header />

      <main className='content'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/categorias' element={<Categories/>}/>
          <Route path='/favoritos' element={<Favorites/>}/>
          <Route path='/sobre' element={<About/>}/>
          <Route path='/filme/:id/:title' element={<MovieDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;