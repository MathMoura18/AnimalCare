import { useAuth } from "./AuthContext";

import "../css/PerfilPopup.css"; // Crie ou adicione estilo aqui conforme desejar
import { useNavigate } from 'react-router-dom';

export default function PerfilPopup({ onClose }: { onClose: () => void }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleClickDashboard = () => {
    navigate('/dashboard');
  };

  const handleClickSair = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="perfil-popup-overlay">
      <div className="perfil-popup">
        <h2>Perfil</h2>
        <p><strong>Nome:</strong> {user?.name}</p>
        <p><strong>{role === 'ong' ? "CNPJ:" : "CPF:"}</strong> {role === 'ong' ? user?.cnpj : user?.cpf}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Cidade:</strong> {user?.city}</p>

        <div className="perfil-dashboard flex justify-center">
          <button onClick={handleClickDashboard} className="button-dashboard bg-blue-500 hover:cursor-pointer">Ver perfil</button>
        </div>

        <div className="perfil-popup-actions">
          <button onClick={handleClickSair} className="sair-btn">Sair da Conta</button>
          <button onClick={onClose} className="fechar-btn">X</button>
        </div>
      </div>
    </div>
  );
}
