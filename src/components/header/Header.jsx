import { NavLink } from 'react-router-dom';
import './header.css';
import { useEffect, useState } from 'react';
import { getGenres } from '../../services/tmdbService';
import { slugify } from '../../utils/slugify'

function Header() {
    // Estados para controle de interface de dados
    const [menuOpen, setMenuOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    // Busca os gêneros no TMDB
    useEffect(() => {
        async function fetchGenres() {
            const data = await getGenres();
            setGenres(data.genres);
        }
        fetchGenres();
    }, []);

    // Controle de rolagem da tela com o menu aberto
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [menuOpen]);

    return (
        <header>
            {/* Sobreposição para fechar o menu ao clicar fora (em dispositivos móveis) */}
            {menuOpen && (
                <div className='menu-overlay' onClick={() => setMenuOpen(false)} />
            )}

            <nav className='nav'>
                {/* Botão para alternar o menu em dispositivos móveis */}
                <button 
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <ul className={`menu ${menuOpen ? 'open' : ''}`}>

                    {/* Página inicial */}
                    <li>
                        <NavLink to='/' end onClick={() => setMenuOpen(false)}>
                            Página inicial
                        </NavLink>
                    </li>

                    {/* Categorias com submenu */}
                    <li className='menu-categories'>
                        <span
                            onClick={() => setCategoriesOpen(prev => !prev)}
                        >
                            Categorias ▾
                        </span>
                        <ul className={`submenu ${categoriesOpen ? 'open' : ''}`}>
                            {genres.map(genre => (
                                <li key={genre.id}>
                                    <NavLink
                                        to={`/categorias/${genre.id}/${slugify(genre.name)}`}
                                        state={{genreRealName : genre.name}}
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setCategoriesOpen(false);
                                        }}
                                    >
                                        {genre.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Favoritos */}
                    <li>
                        <NavLink to='/favoritos' onClick={() => setMenuOpen(false)}>
                            Favoritos
                        </NavLink>
                    </li>

                    {/* Sobre */}
                    <li>
                        <NavLink to='/sobre' onClick={() => setMenuOpen(false)}>
                            Sobre
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;