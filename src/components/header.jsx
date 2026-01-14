import { NavLink } from 'react-router-dom';
import './header.css';
import { useState } from 'react';

function Header() {
    // Estado para controlar o menu responsivo
    const [menuOpen, setMenuOpen] = useState(false);

    // Define os itens do menu de navegação
    const menuItems = [
        { label: 'Página inicial', path: '/', end: true},
        { label: 'Categorias', path: '/categorias' },
        { label: 'Favoritos', path: '/favoritos' },
        { label: 'Sobre', path: '/sobre' }
    ];

    return (
        <header>
            {/* Sobreposição para fechar o menu ao clicar fora (em dispositivos móveis) */}
            {menuOpen && (
                <div className='menu-overlay' onClick={() => setMenuOpen(false)} />
            )}
            <nav className='nav'>

                {/* Botão para alternar o menu em dispositivos móveis */}
                <button 
                    className={`menu-toggle ${menuOpen ? 'hidden' : ''}`} 
                    onClick={() => setMenuOpen(true)}
                >
                    ☰
                </button>

                <ul className={`menu ${menuOpen ? 'open' : ''}`}>
                    {/* Mapeia os itens do menu para links de navegação e testa a rota ativa */}
                    {menuItems.map(({ label, path, end }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                end={end}
                                /* Identifica a rota ativa para aplicar estilos */
                                className={({ isActive }) => (isActive ? 'active' : '')}
                                /* Fecha o menu ao clicar em um link (em dispositivos móveis) */
                                onClick={() => setMenuOpen(false)}
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