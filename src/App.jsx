import './styles/App.css'
import Header from './components/Header.jsx';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer.jsx';

function App() {

  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<h2>Página Inicial</h2>}/>
        <Route path='/categorias' element={<h2>Categorias</h2>}/>
        <Route path='/favoritos' element={<h2>Favoritos</h2>}/>
        <Route path='/sobre' element={<h2>Sobre</h2>}/>
      </Routes>
      <h1>Catálogo de filmes</h1>

      <Footer />
    </>
  )
}

export default App;