import { useAuth } from '../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/authSchema';
import Button from '../../components/button/Button';
import '../../styles/auth.css';

function Login() {
	const { login } = useAuth();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/';

	const {
		register: registerLogin,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const loginMutation = useMutation({
		mutationFn: async (data) => await login(data.email, data.password),
		onSuccess: (response) => {
			showToast(response);
			navigate(from, { replace: true });
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const onSubmit = (data) => {
		loginMutation.mutate(data);
	};

	const isPending = loginMutation.isPending;

	return (
		<main>
			<h2>Entrar</h2>

			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="auth-input-wrapper">
					<div className="auth-input-group">
						<label htmlFor="email">E-mail</label>
						<input
							type="email"
							id="email"
							{...registerLogin('email')}
							placeholder="seu@email.com"
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
							{...registerLogin('password')}
							placeholder="••••••••"
							disabled={isPending}
						/>
						{errors.password && (
							<span className="error">{errors.password.message}</span>
						)}
					</div>

					<Button type="submit" loading={isPending} variant="primary">
						Entrar
					</Button>
				</div>
			</form>

			<p>
				Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
			</p>
		</main>
	);
}

export default Login;
