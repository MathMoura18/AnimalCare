import React from "react";
import { useAuth } from "../components/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from '../components/PerfilPopup';

import "../css/style.css";
import "../css/Perfil.css";

export const Perfil = () => {
    const { user, role } = useAuth();
    const [chatVisivel, setChatVisivel] = React.useState(false);
    const [doacaoVisivel, setDoacaoVisivel] = React.useState(false);
    const [perfilVisivel, setPerfilVisivel] = React.useState(false);

    const PerfilItem = ({ label, value }: { label: string; value?: string | number | null }) => (
        <div className="perfil-item">
            <strong>{label}:</strong> <span>{value ?? "-"}</span>
        </div>
    );

    return (
        <>
            <Header
                onChatClick={() => setChatVisivel((v) => !v)}
                onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
                onPerfilClick={() => setPerfilVisivel((v) => !v)}
            />

            <main role="main">
                <div className="body-perfil">
                    <div className="header">
                        <h1>Informações do Perfil</h1>
                    </div>

                    <div className="perfis">
                        {role === "ong" ? (
                            <>
                                <PerfilItem label="Nome da ONG" value={user?.corporateName} />
                                <PerfilItem label="Representante" value={user?.representative} />
                                <PerfilItem label="CNPJ" value={user?.cnpj} />
                                <PerfilItem label="Email" value={user?.email} />
                                <PerfilItem label="Contato" value={user?.contact} />
                                <PerfilItem label="Estado" value={user?.state} />
                                <PerfilItem label="Cidade" value={user?.city} />
                                <PerfilItem label="Bairro" value={user?.neighborhood} />
                                <PerfilItem label="Pátio" value={user?.patio} />
                                <PerfilItem label="CEP" value={user?.zipcode} />
                            </>
                        ) : (
                            <>
                                <PerfilItem label="Nome" value={user?.name} />
                                <PerfilItem label="CPF" value={user?.cpf} />
                                <PerfilItem label="Data de Nascimento" value={user?.dateOfBirth} />
                                <PerfilItem label="Email" value={user?.email} />
                                <PerfilItem label="Telefone" value={user?.telephone} />
                                <PerfilItem label="Estado" value={user?.state} />
                                <PerfilItem label="Cidade" value={user?.city} />
                                <PerfilItem label="Bairro" value={user?.neighborhood} />
                                <PerfilItem label="Pátio" value={user?.patio} />
                                <PerfilItem label="CEP" value={user?.zipcode} />
                            </>
                        )}
                    </div>
                    <div className="header">
                        <h1>Animais Adotados</h1>
                        <div className="card-exemplo">
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                            <div className="card">Exemplo</div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {chatVisivel && <Chat onClose={() => setChatVisivel(false)} />}
            {doacaoVisivel && <DoacaoPopup onClose={() => setDoacaoVisivel(false)} />}
            {perfilVisivel && <PerfilPopup onClose={() => setPerfilVisivel(false)} />}
        </>
    );
};
