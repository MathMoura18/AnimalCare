import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../components/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from "../components/PerfilPopup";
import { Pencil } from "lucide-react"; // ícone do lápis (instale com: npm install lucide-react)
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
      if (decoded.role.toLowerCase() === "customer"){
        setUserRoleCustomer(true);
        setUserRoleOng(false);

        const response = await getWithProactiveAuth(`/customer/${decoded.userId}`);

        setUser(response.data);
        setFormData(response.data);

      } else if (decoded.role.toLowerCase() === "ong"){
        setUserRoleOng(true);
        setUserRoleCustomer(false);

        const response = await getWithProactiveAuth(`/ong/${decoded.userId}`);

        setUser(response.data);
        setFormData(response.data);

      } else {
        return <Navigate to="/login"/>;
      }

    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
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

      if (userRoleCustomer){
        await getWithProactiveAuth(`/customer/${decoded.userId}`, {
          method: "PUT",
          data: formData,
        });

        setUser(formData);
        setEditando(false);

        alert("Alteração bem-sucedida!")
      } else if (userRoleOng){
        await getWithProactiveAuth(`/ong/${decoded.userId}`, {
          method: "PUT",
          data: formData,
        });

        setUser(formData);
        setEditando(false);

        alert("Alteração bem-sucedida!")
      } else {
        alert("Erro ao reconhecer o tipo de usuário.")
      }
      
    } catch (err) {
      alert("Falha na alteração.")
      console.error("Erro ao salvar dados:", err);
    }
  }

  async function loadAnimalsByUserId() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode<DecodedToken>(token);

    const response = await getWithProactiveAuth(`/animals/${decoded.userId}`);
    setAnimalsByUserId(response.data);
  }

  if (!user || !formData) return <div className="p-6">Carregando...</div>;

  return (
    <>
      <Header
        onChatClick={() => setChatVisivel((v) => !v)}
        onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
        onPerfilClick={() => setPerfilVisivel((v) => !v)}
      />

      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{marginTop: "2rem"}}>
          {user.name}
        </h1>

        <div className="flex flex-col md:flex-row gap-16 mb-6">
          {userRoleCustomer && !userRoleOng ? (
              <div className="bg-white rounded-2xl shadow p-10 w-[700px] relative padd margin-2">

              {/* Botão Editar no canto superior direito */}
              {!editando && (
                <button
                  onClick={() => setEditando(true)}
                  className="absolute top-4 right-4 flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Pencil className="w-5 h-5 mr-1" />
                  Editar
                </button>
              )}

              <h2 className="text-xl font-semibold mb-4 text-blue-600 text-center">
                Informações Pessoais
              </h2>

              {["name", "email", "cpf", "dateOfBirth"].map((field) => (
                <div key={field} className="margin-3">
                  <label className="font-bold capitalize block">
                    {field === "dateOfBirth" ? "Data de Nascimento" : field}:
                  </label>
                  {editando ? (
                    <input
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="ml-2">{(user as any)[field]}</span>
                  )}
                </div>
              ))}

              {/* Campo de alteração de senha */}
              {editando && (
                <div className="mb-6">
                  <label className="font-bold block">Nova Senha:</label>
                  <input
                    type="password"
                    name="password"
                    value={(formData as any).password || ""}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="font-bold block">Status:</label>
                <span className="ml-2">{user.status ? "Ativo" : "Inativo"}</span>
              </div>

              <h2 className="text-xl font-semibold my-6 text-green-600 text-center">
                Endereço e Contato
              </h2>

              {["telephone", "state", "city", "neighborhood", "patio", "zipcode"].map((field) => (
                <div key={field} className="margin-3">
                  <label className="font-bold capitalize block">
                    {field === "zipcode" ? "CEP" : field === "patio" ? "Pátio" : field}:
                  </label>
                  {editando ? (
                    <input
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="ml-2">{(user as any)[field]}</span>
                  )}
                </div>
              ))}

              <h2 className="text-xl font-semibold mt-6 text-purple-600 text-center">
                Registro
              </h2>
              <p className="mt-2">
                <strong>Data de criação:</strong>{" "}
                {new Date(user.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Última atualização:</strong>{" "}
                {new Date(user.updated_at).toLocaleString()}
              </p>

              {/* Botões de ação */}
              {editando && (
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer"
                    onClick={handleSalvar}
                  >
                    Salvar
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:cursor-pointer"
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
            ) : userRoleOng && !userRoleCustomer ? (
                  <div className="bg-white rounded-2xl shadow p-10 w-[700px] relative padd margin-2">
                    {/* Botão Editar */}
                    {!editando && (
                      <button
                        onClick={() => setEditando(true)}
                        className="absolute top-4 right-4 flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <Pencil className="w-5 h-5 mr-1" />
                        Editar
                      </button>
                    )}

                    {/* Identificação da empresa */}
                    <h2 className="text-xl font-semibold mb-4 text-blue-600 text-center">
                      Dados da Empresa
                    </h2>

                    {["corporateName", "cnpj", "representative", "name", "email", "contact"].map((field) => (
                      <div key={field} className="margin-3">
                        <label className="font-bold capitalize block">
                          {{
                            corporateName: "Razão Social",
                            cnpj: "CNPJ",
                            representative: "Representante",
                            name: "Nome Fantasia",
                            email: "Email",
                            contact: "Contato",
                          }[field] || field}
                          :
                        </label>
                        {editando ? (
                          <input
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          <span className="ml-2">{(user as any)[field]}</span>
                        )}
                      </div>
                    ))}

                    {/* Campo de alteração de senha */}
                    {editando && (
                      <div className="mb-6">
                        <label className="font-bold block">Nova Senha:</label>
                        <input
                          type="password"
                          name="password"
                          value={(formData as any).password || ""}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="font-bold block">Status:</label>
                      <span className="ml-2">{user.status ? "Ativo" : "Inativo"}</span>
                    </div>

                    {/* Endereço */}
                    <h2 className="text-xl font-semibold my-6 text-green-600 text-center">
                      Endereço
                    </h2>

                    {["state", "city", "neighborhood", "patio", "zipcode"].map((field) => (
                      <div key={field} className="margin-3">
                        <label className="font-bold capitalize block">
                          {{
                            state: "Estado",
                            city: "Cidade",
                            neighborhood: "Bairro",
                            patio: "Pátio",
                            zipcode: "CEP",
                          }[field] || field}
                          :
                        </label>
                        {editando ? (
                          <input
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          <span className="ml-2">{(user as any)[field]}</span>
                        )}
                      </div>
                    ))}

                    {/* Registro */}
                    <h2 className="text-xl font-semibold mt-6 text-purple-600 text-center">
                      Registro
                    </h2>
                    <p className="mt-2">
                      <strong>Data de criação:</strong> {new Date(user.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Última atualização:</strong> {new Date(user.updated_at).toLocaleString()}
                    </p>

                    {/* Ações */}
                    {editando && (
                      <div className="flex justify-center mt-6 gap-4">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded hover:cursor-pointer"
                          onClick={handleSalvar}
                        >
                          Salvar
                        </button>
                        <button
                          className="bg-gray-400 text-white px-4 py-2 rounded hover:cursor-pointer"
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
            ) : ""
          }

          {animalsByUserId.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-10 w-[900px] relative padd margin-2">
              {userRoleCustomer ? (
                <h2 className="text-xl font-semibold text-center" style={{marginBottom: "1rem"}}>
                  Seus animais adotados:
                </h2>
              ): userRoleOng ? (
                <h2 className="text-xl font-semibold text-center" style={{marginBottom: "1rem"}}>
                  Seus animais para adoção:
                </h2>
              ): ""}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                {animalsByUserId.map((animal, index) => (
                  <CardDashboard
                    key={`${index}`}
                    animal={animal}
                  />
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