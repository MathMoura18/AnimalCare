import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import Card from '../components/Card';
import AnimalPopup from '../components/AnimalPopup/AnimalPopup';
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from '../components/PerfilPopup';

import { api } from "../services/api";
import { useAuth } from '../components/AuthContext';
import ".././css/Card.css"
import ".././css/style.css"

interface Animal {
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

export const QueroAdotar = () => {
    const [animalSelecionado, setAnimalSelecionado] = React.useState<Animal | null>(null);
    const [chatVisivel, setChatVisivel] = React.useState(false);
    const [doacaoVisivel, setDoacaoVisivel] = React.useState(false);
    const [perfilVisivel, setPerfilVisivel] = React.useState(false);

    const [animalsInSameCity, setAnimalsInSameCity] = React.useState<Animal[]>([]);
    const [animalsInOtherCities, setAnimalsInOtherCities] = React.useState<Animal[]>([]);
    const [userCity, setUserCity] = React.useState("");
    const [userState, setUserState] = React.useState("");

    const { role, isAuthenticated, loading } = useAuth();

    useEffect(() => {
        loadAnimals();
    }, []);

    async function loadAnimals() {
        const apiResponse = await getUserLocation();
        if (!apiResponse) return;

        const location = {
            state: apiResponse.region,
            city: apiResponse.city
        };

        setUserCity(location.city);
        setUserState(location.state);

        try {
            const response = await api.get("/animalsByLocation", { params: location });

            setAnimalsInSameCity(response.data.animalsInSameCity || []);
            setAnimalsInOtherCities(response.data.animalsInOtherCities || []);
        } catch (error) {
            console.error("Erro ao buscar animais:", error);
        }
    }

    async function getUserLocation() {
        try {
            const response = await fetch("https://ipwho.is/");
            if (!response.ok) {
                throw new Error("Erro na resposta da API de localização");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao buscar localização:", error);
            return null;
        }
    }

    return (
        <>
            <Header
                onChatClick={() => setChatVisivel((v) => !v)}
                onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
                onPerfilClick={() => setPerfilVisivel((v) => !v)}
            />
            <div className="infos">
                <h1>Campanha de Adoção</h1>
                <h2>Uma seleção de pets que buscam um lar para chamar de seu.</h2>
            </div>

            {!loading && isAuthenticated && role === 'ong' && (
                <Link to="/AdicionarAnimais" className="fixed-button"
                >+ Adicionar Animal</Link>
            )}

            <div className="QAdotar-container" style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                {animalsInSameCity.length > 0 && (
                    <div>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
                            Animais disponíveis em {userCity}:
                        </h1>
                        <div className="animal-list" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                            {animalsInSameCity.map((animal, index) => (
                                <Card
                                    key={`city-${index}`}
                                    animal={animal}
                                    onClick={() => setAnimalSelecionado(animal)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {animalsInOtherCities.length > 0 && (
                    <div>
                        <h1 style={{ fontSize: "2.5rem", marginBottom: "1.5rem", marginTop: "2rem" }}>
                            Animais disponíveis em outras cidades de {userState}:
                        </h1>
                        <div className="animal-list" style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                            {animalsInOtherCities.map((animal, index) => (
                                <Card
                                    key={`state-${index}`}
                                    animal={animal}
                                    onClick={() => setAnimalSelecionado(animal)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />

            {chatVisivel && <Chat onClose={() => setChatVisivel(false)} />}
            {doacaoVisivel && <DoacaoPopup onClose={() => setDoacaoVisivel(false)} />}
            {perfilVisivel && <PerfilPopup onClose={() => setPerfilVisivel(false)} />}
            {animalSelecionado && (<AnimalPopup animal={animalSelecionado} onClose={() => setAnimalSelecionado(null)} />)}
        </>
    );
}