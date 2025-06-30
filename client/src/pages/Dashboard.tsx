import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../components/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from "../components/PerfilPopup";
import { Pencil } from "lucide-react";
import CardDashboard from "../components/CardDashboard";
import "../css/Dashboard.css";
import { Navigate } from "react-router-dom";

interface DecodedToken {
  userId: string;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cnpj: string;
  corporateName: string;
  dateOfBirth: string;
  telephone: string;
  state: string;
  zipcode: string;
  city: string;
  neighborhood: string;
  patio: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  password?: string;
  representative?: string;
  contact?: string;
}

interface Animal {
  id: string;
  imageUrl: string;
  name: string;
  age: number;
  gender: string;
  size: number;
  kind: string;
  race: string;
  state: string;
  city: string;
  status: string;
  weight?: number;
  description?: string;
}

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [userRoleCustomer, setUserRoleCustomer] = useState(false);
  const [userRoleOng, setUserRoleOng] = useState(false);
  const [editando, setEditando] = useState(false);
  const [chatVisivel, setChatVisivel] = useState(false);
  const [doacaoVisivel, setDoacaoVisivel] = useState(false);
  const [perfilVisivel, setPerfilVisivel] = useState(false);
  const [animalsByUserId, setAnimalsByUserId] = useState<Animal[]>([]);

  const { getWithProactiveAuth } = useAuth();

  useEffect(() => {
    loadUser();
    loadAnimalsByUserId();
  }, []);

  async function loadUser() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role.toLowerCase() === "customer") {
        setUserRoleCustomer(true);
        const response = await getWithProactiveAuth(`/customer/${decoded.userId}`);
        setUser(response.data);
        setFormData(response.data);
      } else if (decoded.role.toLowerCase() === "ong") {
        setUserRoleOng(true);
        const response = await getWithProactiveAuth(`/ong/${decoded.userId}`);
        setUser(response.data);
        setFormData(response.data);
      } else {
        return <Navigate to="/login" />;
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
  }

  async function loadAnimalsByUserId() {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode<DecodedToken>(token);
    const response = await getWithProactiveAuth(`/animals/${decoded.userId}`);
    setAnimalsByUserId(response.data);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSalvar() {
    if (!formData) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode<DecodedToken>(token);

      if (userRoleCustomer) {
        await getWithProactiveAuth(`/customer/${decoded.userId}`, {
          method: "PUT",
          data: formData,
        });
      } else if (userRoleOng) {
        await getWithProactiveAuth(`/ong/${decoded.userId}`, {
          method: "PUT",
          data: formData,
        });
      }
      setUser(formData);
      setEditando(false);
      alert("Alteração bem-sucedida!");
    } catch (err) {
      alert("Falha na alteração.");
      console.error("Erro ao salvar dados:", err);
    }
  }

  if (!user || !formData) return <div>Carregando...</div>;

  const commonFields = userRoleCustomer
    ? ["name", "email", "cpf", "dateOfBirth"]
    : ["corporateName", "cnpj", "representative", "name", "email", "contact"];
  const addressFields = ["state", "city", "neighborhood", "patio", "zipcode"];
  const labels: Record<string, string> = {
    corporateName: "Razão Social",
    cnpj: "CNPJ",
    representative: "Representante",
    name: userRoleCustomer ? "Nome" : "Nome Fantasia",
    email: "Email",
    contact: "Contato",
    cpf: "CPF",
    dateOfBirth: "Data de Nascimento",
    telephone: "Telefone",
    state: "Estado",
    city: "Cidade",
    neighborhood: "Bairro",
    patio: "Pátio",
    zipcode: "CEP",
  };

  return (
    <>
      <Header
        onChatClick={() => setChatVisivel(!chatVisivel)}
        onDoacaoClick={() => setDoacaoVisivel(!doacaoVisivel)}
        onPerfilClick={() => setPerfilVisivel(!perfilVisivel)}
      />
      <div className="dashboard-container">
        <h1 className="dashboard-title">{user.name}</h1>

        <div className="dashboard-content">
          <div className="dashboard-card">
            {!editando && (
              <button onClick={() => setEditando(true)} className="edit-button">
                <Pencil className="icon" /> Editar
              </button>
            )}

            <h2 className="section-title">
              {userRoleCustomer ? "Informações Pessoais" : "Dados da Empresa"}
            </h2>

            {commonFields.map((field) => (
              <div key={field} className="field-group">
                <label className="field-label">{labels[field]}:</label>
                {editando ? (
                  <input
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="field-input"
                  />
                ) : (
                  <span className="field-value">{(user as any)[field]}</span>
                )}
              </div>
            ))}

            {editando && (
              <div className="field-group">
                <label className="field-label">Nova Senha:</label>
                <input
                  type="password"
                  name="password"
                  value={(formData as any).password || ""}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            )}

            <div className="field-group">
              <label className="field-label">Status:</label>
              <span className="field-value">{user.status ? "Ativo" : "Inativo"}</span>
            </div>

            <h2 className="section-title">
              {userRoleCustomer ? "Endereço e Contato" : "Endereço"}
            </h2>

            {addressFields.map((field) => (
              <div key={field} className="field-group">
                <label className="field-label">{labels[field]}:</label>
                {editando ? (
                  <input
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="field-input"
                  />
                ) : (
                  <span className="field-value">{(user as any)[field]}</span>
                )}
              </div>
            ))}

            <h2 className="section-title">Registro</h2>
            <p><strong>Data de criação:</strong> {new Date(user.created_at).toLocaleString()}</p>
            <p><strong>Última atualização:</strong> {new Date(user.updated_at).toLocaleString()}</p>

            {editando && (
              <div className="button-group">
                <button className="btn btn-save" onClick={handleSalvar}>Salvar</button>
                <button
                  className="btn btn-cancel"
                  onClick={() => {
                    setFormData(user);
                    setEditando(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {animalsByUserId.length > 0 && (
            <div className="dashboard-card">
              <h2 className="section-title">
                {userRoleCustomer ? "Seus animais adotados:" : "Seus animais cadastrados:"}
              </h2>
              <div className="animal-grid">
                {animalsByUserId.map((animal, index) => (
                  <CardDashboard key={animal.id || index} animal={animal} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
      {chatVisivel && <Chat onClose={() => setChatVisivel(false)} />}
      {doacaoVisivel && <DoacaoPopup onClose={() => setDoacaoVisivel(false)} />}
      {perfilVisivel && <PerfilPopup onClose={() => setPerfilVisivel(false)} />}
    </>
  );
};
