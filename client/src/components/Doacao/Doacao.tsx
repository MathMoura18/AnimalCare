import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // ajuste o caminho se necessário
import './Doacao.css';

export default function DoacaoPopup({ onClose }: { onClose: () => void }) {
  const [valor, setValor] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDoar = () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para doar.");
      navigate('/login'); // redireciona para login
      return;
    }

    if (!valor || parseFloat(valor) <= 0) {
      alert("Insira um valor válido para doar.");
      return;
    }

    // Aqui você pode adicionar lógica real de doação com API, se quiser
    alert("Doação realizada com sucesso!");
    setValor('');
    onClose(); // Fecha o popup após a doação
  };

  return (
    <div className="doacao-popup">
      <div className="doacao-header">
        Doação
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div className="doacao-body">
        <h4>Vantagens</h4>
        <ul>
          <li>Exclusividade nas filas de espera</li>
          <li>Notificações de novos animais para adoção</li>
          <li>Logo de assinatura ao lado do nickname</li>
        </ul>

        <label htmlFor="valor-input">Valor da doação</label>
        <input
          id="valor-input"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Digite o valor que deseja doar"
        />
        <button className="doar-btn" onClick={handleDoar}>
          DOAR R$ {valor ? parseFloat(valor).toFixed(2) : 'XX'}
        </button>
      </div>
    </div>
  );
}
