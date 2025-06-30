import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Chat from '../../components/Chat/Chat';
import DoacaoPopup from '../../components/Doacao/Doacao';
import '../../css/dicasPages.css';
import PerfilPopup from '../../components/PerfilPopup';

export const Dica01 = () => {
    const [chatVisivel, setChatVisivel] = React.useState(false);
    const [doacaoVisivel, setDoacaoVisivel] = React.useState(false);
    const [perfilVisivel, setPerfilVisivel] = React.useState(false);

    return (
        <>
            <Header
                onChatClick={() => setChatVisivel((v) => !v)}
                onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
                onPerfilClick={() => setPerfilVisivel((v) => !v)}

            />

            <main className="dica-container">
                <div className="dica-content">
                    <h1>Dica 1</h1>
                    <div className="dica-image">
                        <img src="/AnimalCare/Images/Luna.jpg" alt="Luna" />
                    </div>
                    <div className="dica-texto">
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed itaque odit ullam dolores. Vel quaerat magni expedita, consequuntur, aspernatur maxime itaque autem sapiente porro natus deleniti tempora quos perspiciatis enim!
                            Illum sed quibusdam cumque reprehenderit qui error magnam! Culpa excepturi, magnam provident id quibusdam assumenda, aspernatur repellat, dicta amet consectetur ex eum placeat. Ea labore cumque excepturi magni qui voluptas?
                            Doloribus nam assumenda cum quas, ab neque sunt! Accusantium ipsam veniam perferendis laudantium aliquid molestiae beatae! Sit maxime quae rem similique. Dolores possimus ipsum numquam laborum tenetur eum dolorem sapiente.

                        </p>
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
