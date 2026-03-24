import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import Button from "../../components/button/Button";
import '../../styles/auth.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] =useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Entrar</h2>

                <div className="auth-input-wrapper">

                    <div className="auth-input-group">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Senha</label>
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                    >
                        Entrar
                    </Button>
                </div>

                {error && (
                    <ErrorMessage
                        message={error}
                        variant="compact"
                    />
                )}

                <p className="auth-footer">
                    Não tem uma conta? <Link to='/cadastro'>Cadastre-se</Link>
                </p>
            </form>
        </main>
    )
}

export default Login;