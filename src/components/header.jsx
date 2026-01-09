import { NavLink } from 'react-router-dom';
import './header.css';

function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><NavLink to={"/"}>Página inicial</NavLink></li>
                    <li><NavLink to={"/categorias"}>Categorias</NavLink></li>
                    <li><NavLink to={"/favoritos"}>Favoritos</NavLink></li>
                    <li><NavLink to={"/sobre"}>Sobre</NavLink></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;