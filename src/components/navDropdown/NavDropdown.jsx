import { NavLink } from "react-router-dom";
import './navDropdown.css';

function NavDropdown({
    label,
    items,
    isOpen,
    onToggle,
    onCloseMenu,
    isUserMenu = false
}) {
    const handleLinkClick = () => {
        onCloseMenu();
    };

    return (
        <li 
            className={`nav-dropdown ${isOpen ? 'open' : ''}`}
            onMouseEnter={() => {
                if (window.innerWidth > 768) onToggle(true);
            }}
            onMouseLeave={() => {
                if (window.innerWidth > 768) onToggle(false);
            }}
        >
            <button
                type="button"
                className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => {
                    if (window.innerWidth <= 768) {
                        onToggle(!isOpen);
                    }
                }}
                aria-expanded={isOpen}
            >
                {label} <span className="arrow">▾</span>
            </button>

            <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.type === 'button' ? (
                            <button
                                className="dropdown-btn"
                                onClick={() => { item.onClick(); handleLinkClick(); }}
                            >
                                {item.label}
                            </button>
                        ) : (
                            <NavLink
                                to={item.to}
                                state={item.state}
                                onClick={handleLinkClick}
                            >
                                {item.label}
                            </NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </li>
    );
}

export default NavDropdown;