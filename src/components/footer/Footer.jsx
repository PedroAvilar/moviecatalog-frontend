import './footer.css';

function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<p>&copy; MovieCatalog {year}. Todos os direitos reservados.</p>
			<p>
				Desenvolvido por{' '}
				<a
					href="https://github.com/PedroAvilar"
					target="_blank"
					rel="noopener noreferrer"
				>
					Pedro Avilar
				</a>
				.
			</p>
		</footer>
	);
}

export default Footer;
