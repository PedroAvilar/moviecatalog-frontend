import { NavLink } from 'react-router-dom';
import './header.css';
import { useEffect, useState } from 'react';
import { getGenres } from '../../services/apiService';
import { slugify } from '../../utils/slugify'
import { useAuth } from '../../context/AuthContext';
import NavDropdown from '../navDropdown/NavDropdown';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
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
        document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [menuOpen]);

    const closeAll = () => {
        setMenuOpen(false)
        setOpenDropdown(null);
    };

    const categoryItems = genres.map(g => ({
        label: g.name,
        to: `/categorias/${g.id}/${slugify(g.name)}`,
        state: { genreRealName: g.name }
    }));

    const userItems = [
        { label: 'Minhas avaliações', to: '/minhas-avaliacoes' },
        { label: 'Meu perfil', to: '/perfil' },
        { label: 'Sair', type: 'button', onClick: logout }
    ];

    return (
        <header>

            {menuOpen && (
                <div 
                    className='menu-overlay' 
                    onClick={closeAll}
                />
            )}

            <nav className='nav'>

                <button 
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => {
                        setMenuOpen(prev => {
                            if (prev) setOpenDropdown(false);
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
                            onClick={closeAll}
                        >
                            Página inicial
                        </NavLink>
                    </li>
                    
                    <NavDropdown 
                        label='Categorias'
                        items={categoryItems}
                        isOpen={openDropdown === 'categories'}
                        onToggle={(state) => setOpenDropdown(state ? 'categories' : null)}
                        onCloseMenu={closeAll}
                    />

                    <li>
                        <NavLink 
                            to='/favoritos'
                            onClick={closeAll}
                        >
                            Favoritos
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to='/sobre'
                            onClick={closeAll}
                        >
                            Sobre
                        </NavLink>
                    </li>

                    {signed ? (
                        <NavDropdown
                            label={`Olá, ${user.name.split(' ')[0]}`}
                            items={userItems}
                            isOpen={openDropdown === 'user'}
                            onToggle={(state) => setOpenDropdown(state ? 'user' : null)}
                            onCloseMenu={closeAll}
                            isUserMenu
                        />
                    ) : (
                        <li>
                            <NavLink
                                to='/login'
                                onClick={closeAll}
                            >
                                Entrar
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;