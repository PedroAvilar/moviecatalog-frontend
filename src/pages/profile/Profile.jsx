import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';
import './profile.css';
import { updatePassword, updateProfile, deleteAccount as apiDeleteAccount, getMe } from '../../services/apiService';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';

function Profile() {
    const { user, logout, updateUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setEditData({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateProfile(editData);
            const freshUser = await getMe();
            updateUser(freshUser);
            setIsEditModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passData.newPassword !== passData.confirmPassword) return alert('As senhas não coincidem');

        try {
            setLoading(true);
            await updatePassword(passData);
            setIsPassModalOpen(false);
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await apiDeleteAccount();
            logout();
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <ErrorMessage message={error}/>

    return (
        <main className='profile-container'>
            <h2>Meu Perfil</h2>

            <section className='profile-section'>
                <div className='section-header'>
                    <h3>Dados pessoais</h3>
                </div>
                <div className='profile-info'>
                    <p>Nome: {user?.name}</p>
                    <p>E-mail: {user?.email}</p>
                    <Button 
                        variant='secondary'
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Editar
                    </Button>
                </div>
            </section>

            <section className='profile-section'>
                <div className='section-header'>
                    <h3>Segurança</h3>
                </div>
                <Button
                    variant='secondary'
                    onClick={() => setIsPassModalOpen(true)}
                >
                    Alterar senha
                </Button>
            </section>

            <section className='profile-section'>
                <div className='section-header'>
                    <h3>Zona de perigo</h3>
                </div>
                <p>Ao excluir sua conta, todas as suas avaliações e dados serão removidos permanentemente.</p>
                <Button
                    variant='danger'
                    onClick={handleDeleteAccount}
                >
                    Excluir conta
                </Button>
            </section>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Perfil">
                <form onSubmit={handleUpdateProfile} className="profile-form">
                    <input 
                        type="text" 
                        value={editData.name} 
                        onChange={(e) => setEditData({...editData, name: e.target.value})} 
                        placeholder="Nome"
                        required 
                    />
                    <input 
                        type="email" 
                        value={editData.email} 
                        onChange={(e) => setEditData({...editData, email: e.target.value})} 
                        placeholder="E-mail"
                        required 
                    />
                    <Button 
                        type="submit" 
                        loading={loading}
                    >
                        Salvar
                    </Button>
                </form>
            </Modal>

            <Modal
                isOpen={isPassModalOpen}
                onClose={() => setIsPassModalOpen(false)}
                title='Alterar senha'
            >
                <form onSubmit={handleUpdatePassword} className='profile-form'>
                    <input 
                        type="password" 
                        placeholder='Senha atual'
                        onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Nova senha" 
                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Confirmar nova senha" 
                        onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                        required 
                    />
                    <Button
                        type='submit'
                        loading={loading}
                    >
                        Salvar
                    </Button>
                </form>
            </Modal>
        </main>
    );
}

export default Profile;