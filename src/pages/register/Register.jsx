import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import Button from '../../components/button/Button';
import '../../styles/auth.css';

function Register() {
	const { showToast } = useToast();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const registerMutation = useMutation({
		mutationFn: register,
		onSuccess: (response) => {
			showToast(response);
			navigate('/login');
			showToast({ message: 'Faça o login!' });
		},
		onError: (err) => {
			showToast(err);
		},
	});

	async function handleSubmit(e) {
		e.preventDefault();
		registerMutation.mutate(formData);
	}

	const isRegisterPending = registerMutation.isPending;

	return (
		<main>
			<h2>Criar conta</h2>

			<form onSubmit={handleSubmit}>
				<div className="auth-input-wrapper">
					<div className="auth-input-group">
						<label htmlFor="name">Nome</label>
						<input
							type="text"
							id="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="Pedro"
							disabled={isRegisterPending}
						/>
					</div>

					<div className="auth-input-group">
						<label htmlFor="email">E-mail</label>
						<input
							type="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							required
							placeholder="pedro@exemplo.com"
							disabled={isRegisterPending}
						/>
					</div>

					<div className="auth-input-group">
						<label htmlFor="password">Senha</label>
						<input
							type="password"
							id="password"
							value={formData.password}
							onChange={handleChange}
							required
							placeholder="••••••••"
							disabled={isRegisterPending}
						/>
					</div>

					<Button type="submit" loading={isRegisterPending} variant="primary">
						Cadastrar
					</Button>
				</div>
			</form>

			<p>
				Já possui conta? <Link to="/login">Fazer login</Link>
			</p>
		</main>
	);
}

export default Register;
