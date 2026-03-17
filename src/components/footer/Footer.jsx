import './footer.css';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className='footer'>
            <p>&copy; MovieCatalog {year}. Todos os direitos reservados.</p>
        </footer>
    )
}

export default Footer;