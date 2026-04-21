import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import {
	updatePassword,
	updateProfile,
	deleteAccount as apiDeleteAccount,
} from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';
import './profile.css';

function Profile() {
	const { user, logout, updateUser } = useAuth();
	const { showToast } = useToast();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isPassModalOpen, setIsPassModalOpen] = useState(false);
	const [editData, setEditData] = useState({
		name: user?.name || '',
		email: user?.email || '',
	});
	const [passData, setPassData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [profileToDelete, setProfileToDelete] = useState(null);

	useEffect(() => {
		if (user) {
			setEditData({ name: user.name, email: user.email });
		}
	}, [user]);

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
		setEditData({ name: user?.name || '', email: user?.email || '' });
	};

	const closePassModal = () => {
		setIsPassModalOpen(false);
		setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
	};

	const handleUpdateProfile = (e) => {
		e.preventDefault();
		if (!editData.name || !editData.email) {
			return showToast({ message: 'Todos os campos são obrigatórios' });
		}
		profileMutation.mutate(editData);
	};

	const handleUpdatePassword = (e) => {
		e.preventDefault();

		if (
			!passData.currentPassword ||
			!passData.newPassword ||
			!passData.confirmPassword
		) {
			return showToast({ message: 'Todos os campos são obrigatórios' });
		}

		if (passData.newPassword !== passData.confirmPassword) {
			return showToast({ message: 'As senhas não correspondem' });
		}

		passwordMutation.mutate(passData);
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
				<form onSubmit={handleUpdateProfile}>
					<input
						type="text"
						value={editData.name}
						onChange={(e) => setEditData({ ...editData, name: e.target.value })}
						placeholder="Nome"
						disabled={isProfilePending}
						required
					/>
					<input
						type="email"
						value={editData.email}
						onChange={(e) =>
							setEditData({ ...editData, email: e.target.value })
						}
						placeholder="E-mail"
						disabled={isProfilePending}
						required
					/>

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
				<form onSubmit={handleUpdatePassword}>
					<input
						type="password"
						value={passData.currentPassword}
						placeholder="Senha atual"
						onChange={(e) =>
							setPassData({ ...passData, currentPassword: e.target.value })
						}
						disabled={isPasswordPending}
						required
					/>
					<input
						type="password"
						value={passData.newPassword}
						placeholder="Nova senha"
						onChange={(e) =>
							setPassData({ ...passData, newPassword: e.target.value })
						}
						disabled={isPasswordPending}
						required
					/>
					<input
						type="password"
						value={passData.confirmPassword}
						placeholder="Confirmar nova senha"
						onChange={(e) =>
							setPassData({ ...passData, confirmPassword: e.target.value })
						}
						disabled={isPasswordPending}
						required
					/>

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
