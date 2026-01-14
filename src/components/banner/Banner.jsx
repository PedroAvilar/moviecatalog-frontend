import './banner.css';

function Banner() {
    return (
        <section className='banner'>
            <div className='banner-overlay'>
                <div className='banner-content'>
                    <h2>Destaques da semana</h2>
                    <p>Descubra os filmes mais populares do momento</p>
                </div>
            </div>
        </section>
    );
}

export default Banner;