import React, { useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from '../components/PerfilPopup';

import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

import ".././css/Dicas.css"

export const Home = () => {
    const { getWithProactiveAuth } = useAuth();
    const [chatVisivel, setChatVisivel] = React.useState(false);
    const [doacaoVisivel, setDoacaoVisivel] = React.useState(false);
    const [perfilVisivel, setPerfilVisivel] = React.useState(false);


    useEffect(() => {
        getWithProactiveAuth("/animals");
    }, []);

    return <>
        <Header
            onChatClick={() => setChatVisivel((v) => !v)}
            onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
            onPerfilClick={() => setPerfilVisivel((v) => !v)}
        />

        <div className="card-container">
            <div className="card-dicas">
                <div className="imagem">
                    <img src="AnimalCare/Images/Luna.jpg" alt="imagem" />
                </div>
                <div className="card-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="card-footer">
                    <Link to="/dica-1" className="card-button">Leia mais</Link>
                </div>
            </div>

            <div className="card-dicas">
                <div className="imagem">
                    <img src="AnimalCare/Images/Caramelo.jpg" alt="imagem" />
                </div>
                <div className="card-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="card-footer">
                    <Link to="/dica-2" className="card-button">Leia mais</Link>

                </div>
            </div>

            <div className="card-dicas">
                <div className="imagem">
                    <img src="AnimalCare/Images/Laranjinha.jpg" alt="imagem" />
                </div>
                <div className="card-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="card-footer">
                    <Link to="/dica-3" className="card-button">Leia mais</Link>
                </div>
            </div>

            <div className="card-dicas">
                <div className="imagem">
                    <img src="AnimalCare/Images/Foguete.jpg" alt="imagem" />
                </div>
                <div className="card-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="card-footer">
                    <Link to="/dica-4" className="card-button">Leia mais</Link>

                </div>
            </div>

            <div className="card-dicas">
                <div className="imagem">
                    <img src="AnimalCare/Images/Gato.jpg" alt="imagem" />
                </div>
                <div className="card-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="card-footer">
                    <Link to="/dica-5" className="card-button">Leia mais</Link>

                </div>
            </div>

            <div className="card-dicas">
                <div className="imagem">
                    <img src="AnimalCare/Images/Max.jpg" alt="imagem" />
                </div>
                <div className="card-body">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="card-footer">
                    <Link to="/dica-6" className="card-button">Leia mais</Link>

                </div>
            </div>
        </div>

        <Footer />

        {chatVisivel && <Chat onClose={() => setChatVisivel(false)} />}
        {doacaoVisivel && <DoacaoPopup onClose={() => setDoacaoVisivel(false)} />}
        {perfilVisivel && <PerfilPopup onClose={() => setPerfilVisivel(false)} />}
    </>
}