import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/Chat/Chat";
import DoacaoPopup from "../components/Doacao/Doacao";
import PerfilPopup from '../components/PerfilPopup';
import { jwtDecode } from "jwt-decode";

import "../css/AdicionarAnimais.css";

import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const States = [
    { nome: 'Acre', sigla: 'AC' },
    { nome: 'Alagoas', sigla: 'AL' },
    { nome: 'Amapá', sigla: 'AP' },
    { nome: 'Amazonas', sigla: 'AM' },
    { nome: 'Bahia', sigla: 'BA' },
    { nome: 'Ceará', sigla: 'CE' },
    { nome: 'Distrito Federal', sigla: 'DF' },
    { nome: 'Espírito Santo', sigla: 'ES' },
    { nome: 'Goiás', sigla: 'GO' },
    { nome: 'Maranhão', sigla: 'MA' },
    { nome: 'Mato Grosso', sigla: 'MT' },
    { nome: 'Mato Grosso do Sul', sigla: 'MS' },
    { nome: 'Minas Gerais', sigla: 'MG' },
    { nome: 'Pará', sigla: 'PA' },
    { nome: 'Paraíba', sigla: 'PB' },
    { nome: 'Paraná', sigla: 'PR' },
    { nome: 'Pernambuco', sigla: 'PE' },
    { nome: 'Piauí', sigla: 'PI' },
    { nome: 'Rio de Janeiro', sigla: 'RJ' },
    { nome: 'Rio Grande do Norte', sigla: 'RN' },
    { nome: 'Rio Grande do Sul', sigla: 'RS' },
    { nome: 'Rondônia', sigla: 'RO' },
    { nome: 'Roraima', sigla: 'RR' },
    { nome: 'Santa Catarina', sigla: 'SC' },
    { nome: 'São Paulo', sigla: 'SP' },
    { nome: 'Sergipe', sigla: 'SE' },
    { nome: 'Tocantins', sigla: 'TO' },
];

interface DecodedToken {
  userId: string;
  role: string;
}

export const AdicionarAnimais = () => {
    const navigate = useNavigate();
    const [chatVisivel, setChatVisivel] = React.useState(false);
    const [doacaoVisivel, setDoacaoVisivel] = React.useState(false);
    const [perfilVisivel, setPerfilVisivel] = React.useState(false);

    const [petFormData, setPetFormData] = React.useState({
        name: "",
        idUser: "",
        age: "",
        gender: "",
        size: "",
        kind: "",
        animalPicture: "",
        race: "",
        weight: "",
        state: "",
        city: "",
        description: "",
    });

    const [Cities, setCities] = useState<string[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    function handlePetInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setPetFormData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "state" ? { city: '' } : {}),
        }));
    }

    function handlePetSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { id, value } = e.target;
        setPetFormData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "state" ? { city: '' } : {}),
        }));
    }

    function handlePetStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { id, value } = e.target;

        setPetFormData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "state" ? { city: '' } : {}),
        }));

        // Passa o valor diretamente
        fetchCities(value);
    }

    async function fetchCities(state: string) {
        if (!state) {
            setCities([]);
            return;
        }

        const stateSelected = States.find(s => s.nome === state);
        if (!stateSelected) return;

        setLoadingCities(true);
        try {
            const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateSelected.sigla}/municipios`);
            const data = await res.json();
            setCities(data.map((city: any) => city.nome));
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    }

    useEffect(() => {

    }, [petFormData.state]);

    async function handlePetSubmit(event: React.FormEvent) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = jwtDecode<DecodedToken>(token);

        const formData = new FormData();

        formData.append("idUser", decoded.userId);
        formData.append("name", petFormData.name);
        formData.append("age", petFormData.age);
        formData.append("gender", petFormData.gender);
        formData.append("size", petFormData.size);
        formData.append("kind", petFormData.kind);
        formData.append("race", petFormData.race);
        formData.append("weight", petFormData.weight);
        formData.append("state", petFormData.state);
        formData.append("city", petFormData.city);
        formData.append("description", petFormData.description);

        const animalPictureFile = document.getElementById("animalPicture") as HTMLInputElement;
        if (animalPictureFile.files && animalPictureFile.files[0]) {
            formData.append("animalPicture", animalPictureFile.files[0]);
        }

         try {
            const response = await api.post("/animal", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            navigate("/adotar")
        } catch (error) {
            console.error("Erro ao cadastrar novo animal", error);
        }
    }

    return (
        <>
            <Header
                onChatClick={() => setChatVisivel((v) => !v)}
                onDoacaoClick={() => setDoacaoVisivel((v) => !v)}
                onPerfilClick={() => setPerfilVisivel((v) => !v)}
            />

            <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="titleAnimal">
                    Cadastrar Animal
                </h1>
                
                <div className="createAnimal-box">
                   <div className="box">
                    <form onSubmit={handlePetSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="name">Nome do animal <span className="text-red-500">*</span></label>
                            <input type="text" id="name" value={petFormData.name} onChange={handlePetInputChange}
                                placeholder="Nome"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="kind">Espécie <span className="text-red-500">*</span></label>
                            <select id="kind" value={petFormData.kind} onChange={handlePetSelectChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                <option value="" disabled>Selecione a Espécie</option>
                                <option value="Cachorro">Cachorro</option>
                                <option value="Gato">Gato</option>
                                <option value="Pássaro">Pássaro</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="age">Idade <span className="text-red-500">*</span></label>
                            <input type="text" id="age" value={petFormData.age} onChange={handlePetInputChange}
                                placeholder="Ex: 2"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                                maxLength={3}
                                />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="race">Raça <span className="text-red-500">*</span></label>
                            <input type="text" id="race" value={petFormData.race} onChange={handlePetInputChange}
                                placeholder="Raça do animal"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="gender">Sexo <span className="text-red-500">*</span></label>
                            <select id="gender" value={petFormData.gender} onChange={handlePetSelectChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                <option value="" disabled>Selecione o sexo</option>
                                <option value="M">Macho</option>
                                <option value="F">Fêmea</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="weight">Peso <span className="text-red-500">*</span></label>
                            <input type="text" id="weight" value={petFormData.weight} onChange={handlePetInputChange}
                                placeholder="Ex: 3"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                                maxLength={2}/>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="size">Porte <span className="text-red-500">*</span></label>
                            <select id="size" value={petFormData.size} onChange={handlePetSelectChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                    <option value="" disabled>Selecione o porte</option>
                                    <option value="1">Pequeno</option>
                                    <option value="2">Médio</option>
                                    <option value="3">Grande</option>
                                </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="state">Estado <span className="text-red-500">*</span></label>
                            <select id="state" value={petFormData.state} onChange={handlePetStateChange} 
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                    <option value="" disabled>Selecione um estado</option>
                                    {States.map(est => (
                                        <option key={est.sigla} value={est.nome}>{est.nome}</option>
                                ))}
                                </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="city">Cidade <span className="text-red-500">*</span></label>
                            <select id="city" value={petFormData.city} onChange={handlePetSelectChange} disabled={!petFormData.state || loadingCities}
                                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400
                                    ${(!petFormData.state || loadingCities) ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}>
                                    <option value="">
                                        {loadingCities ? "Carregando cidades..." : "Selecione uma cidade"}
                                    </option>
                                    {Cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="description">Sobre o Pet <span className="text-red-500">*</span></label>
                            <input type="text" id="description" value={petFormData.description} onChange={handlePetInputChange}
                                placeholder="Dócil, brincalhão, gosta de passear..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="animalPicture">Link da Imagem <span className="text-red-500">*</span></label>
                            <input type="file" id="animalPicture" value={petFormData.animalPicture} onChange={handlePetInputChange}
                                placeholder="Link da imagem do animal em conversão picture64"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-yellow-500 text-white py-3 rounded-lg mt-6 hover:bg-yellow-600 transition-colors cursor-pointer"
                            >
                                Cadastrar Animal
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/adotar")}
                            className="text-sm text-indigo-500 hover:underline cursor-pointer"
                        >
                            Voltar
                        </button>
                    </div>
                    </div>
                </div>
            </div>
            

            <Footer />

            {chatVisivel && <Chat onClose={() => setChatVisivel(false)} />}
            {doacaoVisivel && <DoacaoPopup onClose={() => setDoacaoVisivel(false)} />}
            {perfilVisivel && <PerfilPopup onClose={() => setPerfilVisivel(false)} />}
        </>
    );
};
