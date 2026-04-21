import tmdbLogo from '../../assets/logotipo-tmdb.svg';
import './about.css';

function About() {
	return (
		<main>
			<section>
				<h2>Sobre o projeto</h2>
				<p>
					Bem-vindo ao <strong>Movie Catalog</strong>! Um catálogo de filmes
					desenvolvido para oferecer uma experiência fluida e moderna na busca
					por entretenimento, permitindo que você explore tendências, filtre por
					categorias e organize seus filmes favoritos em um só lugar.
				</p>

				<div className="about-features">
					<div className="feature-card">
						<h3>Exploração</h3>
						<p>
							Acesse os títulos mais populares, bem avaliados e navegue por
							categorias de filmes do cinema mundial.
						</p>
					</div>
					<div className="feature-card">
						<h3>Favoritos</h3>
						<p>
							Salve os filmes que você deseja assistir ou que mais gostou com
							apenas um clique.
						</p>
					</div>
					<div className="feature-card">
						<h3>Detalhes</h3>
						<p>
							Confira informações detalhadas de cada filme, incluindo sinopse,
							elenco, direção e produção.
						</p>
					</div>
				</div>

				<div className="about-tmdb">
					<hr className="divider" />

					<section className="tmdb-atribution">
						<img src={tmdbLogo} alt="Logotipo TMDB" className="tmdb-logo" />
						<p>
							Este site utiliza os dados e as APIs do <strong>TMDB</strong> (The
							Movie Database), mas não é endossado, certificado ou aprovado pelo
							TMDB.
						</p>
						<p>
							This website uses TMDB and the TMDB APIs but is not endorsed,
							certified, or otherwise approved by TMDB.
						</p>
					</section>
				</div>
			</section>
		</main>
	);
}

export default About;
