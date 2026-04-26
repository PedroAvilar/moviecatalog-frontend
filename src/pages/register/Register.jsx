import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../schemas/authSchema';
import Button from '../../components/button/Button';
import '../../styles/auth.css';

function Register() {
	const { showToast } = useToast();
	const navigate = useNavigate();

	const {
		register: registerInput,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(registerSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

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

	const onSubmit = (data) => {
		registerMutation.mutate(data);
	};

	const isPending = registerMutation.isPending;

	return (
		<main>
			<h2>Criar conta</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="auth-input-wrapper">
					<div className="auth-input-group">
						<label htmlFor="name">Nome</label>
						<input
							type="text"
							id="name"
							{...registerInput('name')}
							placeholder="Pedro"
							disabled={isPending}
						/>
						{errors.name && (
							<span className="error">{errors.name.message}</span>
						)}
					</div>

					<div className="auth-input-group">
						<label htmlFor="email">E-mail</label>
						<input
							type="email"
							id="email"
							{...registerInput('email')}
							placeholder="pedro@exemplo.com"
							disabled={isPending}
						/>
						{errors.email && (
							<span className="error">{errors.email.message}</span>
						)}
					</div>

					<div className="auth-input-group">
						<label htmlFor="password">Senha</label>
						<input
							type="password"
							id="password"
							{...registerInput('password')}
							placeholder="••••••••"
							disabled={isPending}
						/>
						{errors.password && (
							<span className="error">{errors.password.message}</span>
						)}
					</div>

					<Button type="submit" loading={isPending} variant="primary">
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
