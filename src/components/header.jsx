import { Link } from 'react-router-dom';

function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to={"/"}>Página inicial</Link></li>
                    <li><Link to={"/categorias"}>Categorias</Link></li>
                    <li><Link to={"/favoritos"}>Favoritos</Link></li>
                    <li><Link to={"/sobre"}>Sobre</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;