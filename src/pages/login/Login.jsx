import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useMutation } from "@tanstack/react-query";
import Button from "../../components/button/Button";
import '../../styles/auth.css'

function Login() {
    const { login } = useAuth();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] =useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            return await login(email, password);
        },
        onSuccess: (response)=> {
            showToast(response);
            navigate(from, { replace: true });
        },
        onError: (err) => {
            showToast(err);
        }
    });

    async function handleSubmit(e) {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    }

    const isLoginPending = loginMutation.isPending;

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
                            disabled={isLoginPending}
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
                            disabled={isLoginPending}
                        />
                    </div>
                
                    <Button
                        type="submit"
                        loading={isLoginPending}
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