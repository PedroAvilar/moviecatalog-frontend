import './banner.css';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';

function Banner({ movie }) {
    const navigate = useNavigate(); // Hook para navegação programática

    if (!movie) return null;
    
    const titleSlug = slugify(movie.title); // Gera slug do título do filme

    return (
        <section 
            className='banner'
            // Define a imagem de fundo dinamicamente usando o backdrop (imagem horizontal) da API
            style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}
        >
            <div 
                className='banner-overlay'
                onClick={() => navigate(`/filme/${movie.id}/${titleSlug}`)} // Navega para detalhes do filme
            
            >
                <div className='banner-content'>
                    <h2>{movie.title}</h2>
                    <p>
                        {movie.overview
                            // Limita o conteúdo da descrição exibida
                            ? movie.overview.length > 160
                                ? movie.overview.slice(0, 160) + '...'
                                : movie.overview
                            : 'Sem descrição disponível.'}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Banner;