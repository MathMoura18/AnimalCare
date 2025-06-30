import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/PerfilPopup.css";


export default function PerfilPopup({ onClose }: { onClose: () => void }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleVerMais = () => {
    navigate("/dashboard");
    onClose();

  };

  return (
    <div className="perfil-popup-overlay">
      <div className="perfil-popup">
        <div className="perfil-header">
          <h2>Perfil</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="perfil-popup-content">
          <p><strong>Nome:</strong> {role === "ong" ? user?.corporateName : user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>

          <div className="perfil-popup-actions">
            <button onClick={handleVerMais} className="info-btn">Ver mais informações</button>
            <button onClick={logout} className="sair-btn">Sair da Conta</button>
          </div>

        </div>
      </div>
    </div>
  );
}
