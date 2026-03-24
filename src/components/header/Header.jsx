import { NavLink } from 'react-router-dom';
import './header.css';
import { useEffect, useState } from 'react';
import { getGenres } from '../../services/apiService';
import { slugify } from '../../utils/slugify'
import { useAuth } from '../../context/AuthContext';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const { user, signed, logout } = useAuth();

    useEffect(() => {
        async function fetchGenres() {
            try {
                const data = await getGenres();
                setGenres(data.genres || []);
            } catch (error) {
                console.error('Erro ao carregar gêneros no Header: ', error);
            }
        }
        fetchGenres();
    }, []);

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

            {menuOpen && (
                <div 
                    className='menu-overlay' 
                    onClick={() => {
                        setMenuOpen(false);
                        setCategoriesOpen(false);
                    }}
                />
            )}

            <nav className='nav'>

                <button 
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => {
                        setMenuOpen(prev => {
                            if (prev) setCategoriesOpen(false);
                            return !prev;
                        });
                    }}
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={menuOpen}
                    aria-controls='main-menu'
                >
                    <span />
                    <span />
                    <span />
                </button>

                <ul 
                    id='main-menu'
                    className={`menu ${menuOpen ? 'open' : ''}`}
                >

                    <li>
                        <NavLink 
                            to='/'
                            onClick={() => {
                                setMenuOpen(false);
                                setCategoriesOpen(false)
                            }}
                        >
                            Página inicial
                        </NavLink>
                    </li>

                    <li 
                        className='menu-categories'
                        onMouseEnter={() => window.innerWidth > 768 && setCategoriesOpen(true)}
                        onMouseLeave={() => window.innerWidth > 768 && setCategoriesOpen(false)}
                    >
                        <button
                            type='button'
                            className={`categories-button ${categoriesOpen ? 'active' : ''}`}
                            aria-expanded={categoriesOpen}
                            aria-controls='categories-submenu'
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    setCategoriesOpen(prev => !prev);
                                }
                            }}
                        >
                            Categorias ▾
                        </button>
                        <ul 
                            id='categories-submenu'
                            className={`submenu ${categoriesOpen ? 'open' : ''}`}
                        >
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

                    <li>
                        <NavLink 
                            to='/favoritos'
                            onClick={() => {
                                setMenuOpen(false);
                                setCategoriesOpen(false)
                            }}
                        >
                            Favoritos
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to='/sobre'
                            onClick={() => {
                                setMenuOpen(false);
                                setCategoriesOpen(false)
                            }}
                        >
                            Sobre
                        </NavLink>
                    </li>

                    <li>
                        {signed ? (
                            <div>
                                <span>Olá, {user.name}</span>
                                <button onClick={logout}>Sair</button>
                            </div>
                        ) : (
                            <NavLink to='login'>Entrar</NavLink>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;