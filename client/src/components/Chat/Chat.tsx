import { useState } from 'react';
import './Chat.css';

type Msg = { texto: string; tipo: 'user' | 'bot' };

export default function ChatPopup({ onClose }: { onClose: () => void }) {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState<Msg[]>([]);
  const [aguardandoOpcao, setAguardandoOpcao] = useState(false);

  const enviarMensagem = () => {
    const msgTrim = mensagem.trim();
    if (msgTrim === '') return;

    if (!aguardandoOpcao) {
      // Mensagem do usuário
      setMensagens((prev) => [
        ...prev,
        { texto: `Você: ${msgTrim}`, tipo: 'user' },
        {
          texto: `1 - Como Adotar\n2 - Dicas de Cuidados de Animais`,
          tipo: 'bot'
        }
      ]);
      setMensagem('');
      setAguardandoOpcao(true);
    } else {
      if (msgTrim === '1') {
        setMensagens(prev => [
          ...prev,
          { texto: 'Você: 1', tipo: 'user' },
          { texto: 'Para adotar um animal se precisa criar uma conta ou entrar com uma conta válida, ir na pagina Quero Adotar e escolher o seu animal!!!', tipo: 'bot' }
        ]);
        setMensagem('');
        setAguardandoOpcao(false);
      } else if (msgTrim === '2') {
        setMensagens(prev => [
          ...prev,
          { texto: 'Você: 2', tipo: 'user' },
          { texto: 'Cuida de um animal como se fosse um filho seu, os animais tem sentimentos como qualquer ser vivo', tipo: 'bot' }
        ]);
        setMensagem('');
        setAguardandoOpcao(false);
      } else {
        setMensagens(prev => [
          ...prev,
          { texto: `Você: ${msgTrim}`, tipo: 'user' },
          { texto: 'Digite 1 ou 2 para receber mais informações', tipo: 'bot' }
        ]);
        setMensagem('');
      }
    }
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      <div className="chat-body">
        {mensagens.map((msg, index) => (
          <div key={index} className={`chat-msg ${msg.tipo}`}>
            {msg.texto}
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={(e) => { if (e.key === 'Enter') enviarMensagem(); }}
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}
