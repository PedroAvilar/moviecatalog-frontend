import { NavLink } from 'react-router-dom';
import './header.css';

function Header() {
    // Define os itens do menu de navegação
    const menuItems = [
        { label: 'Página inicial', path: '/', end: true},
        { label: 'Categorias', path: '/categorias' },
        { label: 'Favoritos', path: '/favoritos' },
        { label: 'Sobre', path: '/sobre' }
    ]

    return (
        <header>
            <nav>
                <ul>
                    {/* Mapeia os itens do menu para links de navegação e testa a rota ativa */}
                    {menuItems.map(({ label, path, end }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                end={end}
                                className={({ isActive }) => (isActive ? 'active' : '')}
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;