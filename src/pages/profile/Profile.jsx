import {
	updatePassword,
	updateProfile,
	deleteAccount as apiDeleteAccount,
} from '../../services/apiService';
import {
	updateProfileSchema,
	updatePasswordSchema,
} from '../../schemas/authSchema';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';
import './profile.css';

function Profile() {
	const { user, logout, updateUser } = useAuth();
	const { showToast } = useToast();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isPassModalOpen, setIsPassModalOpen] = useState(false);
	const [profileToDelete, setProfileToDelete] = useState(null);

	const {
		register: registerProfile,
		handleSubmit: handleSubmitProfile,
		reset: resetProfile,
		formState: { errors: profileErrors },
	} = useForm({
		resolver: zodResolver(updateProfileSchema),
		mode: 'onChange',
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
		},
	});

	const {
		register: registerPassword,
		handleSubmit: handleSubmitPassword,
		reset: resetPassword,
		formState: { errors: passwordErrors },
	} = useForm({
		resolver: zodResolver(updatePasswordSchema),
		mode: 'onChange',
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		if (user) {
			resetProfile({
				name: user.name,
				email: user.email,
			});
		}
	}, [user, resetProfile]);

	const profileMutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: (response) => {
			updateUser(response.user);
			showToast(response);
			setIsEditModalOpen(false);
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const passwordMutation = useMutation({
		mutationFn: updatePassword,
		onSuccess: (response) => {
			showToast(response);
			closePassModal();
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: apiDeleteAccount,
		onSuccess: (response) => {
			showToast(response);
			setProfileToDelete(null);
			logout();
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		resetProfile();
	};

	const closePassModal = () => {
		setIsPassModalOpen(false);
		resetPassword();
	};

	const onSubmitProfile = (data) => {
		profileMutation.mutate(data);
	};

	const onSubmitPassword = (data) => {
		const { confirmPassword, ...payload } = data;
		passwordMutation.mutate(payload);
	};

	const isProfilePending = profileMutation.isPending;
	const isPasswordPending = passwordMutation.isPending;
	const isDeletePending = deleteMutation.isPending;

	return (
		<main>
			<h2>Meu Perfil</h2>

			<section className="profile-section">
				<div className="section-header">
					<h3>Dados pessoais</h3>
				</div>
				<div className="profile-info">
					<p>Nome: {user?.name}</p>
					<p>E-mail: {user?.email}</p>
					<Button
						variant="secondary"
						onClick={() => setIsEditModalOpen(true)}
						loading={isProfilePending}
					>
						Editar
					</Button>
				</div>
			</section>

			<section className="profile-section">
				<div className="section-header">
					<h3>Segurança</h3>
				</div>
				<Button
					variant="secondary"
					onClick={() => setIsPassModalOpen(true)}
					loading={isPasswordPending}
				>
					Alterar senha
				</Button>
			</section>

			<section className="profile-section">
				<div className="section-header">
					<h3>Zona de perigo</h3>
				</div>
				<p>
					Ao excluir sua conta, todas as suas avaliações e dados serão removidos
					permanentemente.
				</p>
				<Button
					variant="danger"
					onClick={() => setProfileToDelete(user)}
					loading={isDeletePending}
				>
					Excluir conta
				</Button>
			</section>

			<Modal
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				title="Editar Perfil"
			>
				<form onSubmit={handleSubmitProfile(onSubmitProfile)}>
					<input
						type="text"
						id="name"
						{...registerProfile('name')}
						placeholder="Nome"
						disabled={isProfilePending}
					/>
					{profileErrors.name && (
						<span className="error">{profileErrors.name.message}</span>
					)}
					<input
						type="email"
						id="email"
						{...registerProfile('email')}
						placeholder="E-mail"
						disabled={isProfilePending}
					/>
					{profileErrors.email && (
						<span className="error">{profileErrors.email.message}</span>
					)}

					<div className="modal-action">
						<Button
							variant="secondary"
							onClick={closeEditModal}
							loading={isProfilePending}
						>
							Cancelar
						</Button>
						<Button type="submit" loading={isProfilePending}>
							Salvar
						</Button>
					</div>
				</form>
			</Modal>

			<Modal
				isOpen={isPassModalOpen}
				onClose={closePassModal}
				title="Alterar senha"
			>
				<form onSubmit={handleSubmitPassword(onSubmitPassword)}>
					<input
						type="password"
						id="currentPassword"
						{...registerPassword('currentPassword')}
						placeholder="Senha atual"
						disabled={isPasswordPending}
					/>
					{passwordErrors.currentPassword && (
						<span className="error">
							{passwordErrors.currentPassword.message}
						</span>
					)}
					<input
						type="password"
						id="newPassword"
						{...registerPassword('newPassword')}
						placeholder="Nova senha"
						disabled={isPasswordPending}
					/>
					{passwordErrors.newPassword && (
						<span className="error">{passwordErrors.newPassword.message}</span>
					)}
					<input
						type="password"
						id="confirmPassword"
						{...registerPassword('confirmPassword')}
						placeholder="Confirmar nova senha"
						disabled={isPasswordPending}
					/>
					{passwordErrors.confirmPassword && (
						<span className="error">
							{passwordErrors.confirmPassword.message}
						</span>
					)}

					<div className="modal-action">
						<Button
							variant="secondary"
							onClick={closePassModal}
							loading={isPasswordPending}
						>
							Cancelar
						</Button>
						<Button type="submit" loading={isPasswordPending}>
							Salvar
						</Button>
					</div>
				</form>
			</Modal>

			<Modal
				isOpen={!!profileToDelete}
				onClose={() => setProfileToDelete(null)}
				title="Confirmar exclusão"
			>
				{user?.name && (
					<p>
						<strong>{profileToDelete?.name}</strong>
					</p>
				)}
				<p>Tem certeza que deseja excluir sua conta?</p>
				<p>
					Essa ação não poderá ser desfeita e também apagará suas avaliações dos
					filmes.
				</p>

				<div className="modal-action">
					<Button
						variant="secondary"
						onClick={() => setProfileToDelete(null)}
						loading={isDeletePending}
					>
						Cancelar
					</Button>
					<Button
						variant="danger"
						onClick={() => deleteMutation.mutate()}
						loading={isDeletePending}
					>
						Excluir
					</Button>
				</div>
			</Modal>
		</main>
	);
}

export default Profile;
