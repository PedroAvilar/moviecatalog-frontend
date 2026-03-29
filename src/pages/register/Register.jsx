import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/apiService";
import { useToast } from "../../context/ToastContext";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import Button from "../../components/button/Button";
import '../../styles/auth.css';

function Register() {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', password: ''});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const response = await register(formData);
            showToast(response);
            navigate('/login');
            showToast({ message: 'Faça o login!'})
        } catch (err) {
            showToast(err)
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Criar conta</h2>

                <div className="auth-input-wrapper">

                    <div className="auth-input-group">
                        <label htmlFor="name">Nome</label>
                        <input 
                            type="text"
                            id="name"
                            onChange={handleChange}
                            required
                            placeholder="Pedro"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            type="email"
                            id="email"
                            onChange={handleChange}
                            required
                            placeholder="pedro@exemplo.com"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password">Senha</label>
                        <input 
                            type="password"
                            id="password"
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                    >
                        Cadastrar
                    </Button>
                </div>

                {error && (
                    <ErrorMessage
                        message={error}
                        variant="compact"
                    />
                )}

                <p className="auth-footer">
                    Já possui conta? <Link to='/login'>Fazer login</Link>
                </p>
            </form>
        </main>
    )
}

export default Register;