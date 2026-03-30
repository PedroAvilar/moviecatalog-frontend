import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/button/Button";
import '../../styles/auth.css'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] =useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await login(email, password);
            showToast(response)
            navigate(from, { replace: true });
        } catch (err) {
            showToast(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h2>Entrar</h2>

            <form onSubmit={handleSubmit}>

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
            </form>

            <p>Não tem uma conta? <Link to='/cadastro'>Cadastre-se</Link></p>
        </main>
    )
}

export default Login;