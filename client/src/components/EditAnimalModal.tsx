import { useState, useEffect } from 'react';
import { api } from "../services/api";
import { useNavigate } from 'react-router-dom';

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

interface AnimalFormData {
    name: string;
    age: number;
    gender: string;
    size: number;
    kind: string;
    race: string;
    weight: number;
    state: string;
    city: string;
    description: string;
    imageUrl: string;
}

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

interface EditAnimalModalProps {
    animal: Animal;
    onClose: () => void;
    onSave: () => void;
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "1000px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    maxHeight: "95vh",
    overflowY: "auto"
};

const contentStyle: React.CSSProperties = {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start"
};

const imageSectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "200px"
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px"
};

const confirmButton: React.CSSProperties = {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "8px 16px",
    marginLeft: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
};

const cancelButton: React.CSSProperties = {
    backgroundColor: "#9ca3af",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
};

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "4px",
    fontWeight: 500,
    fontSize: "14px",
    color: "#374151" // cinza escuro
};

export function EditAnimalModal({ animal, onClose, onSave }: EditAnimalModalProps) {
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState<string>(animal.imageUrl);
    const [Cities, setCities] = useState<string[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    
    const [formData, setFormData] = useState<AnimalFormData>({
        name: animal.name,
        age: animal.age,
        gender: animal.gender,
        size: animal.size,
        kind: animal.kind,
        race: animal.race,
        weight: animal.weight || 0,
        state: animal.state,
        city: animal.city,
        description: animal.description || "",
        imageUrl: animal.imageUrl
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        fetchCities(animal.state);
        return () => {
            document.body.style.overflow = "auto";
        }; 
    }, []);

    function handlePetStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { id, value } = e.target;

        setFormData((prev) => ({
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "age" || name === "size" || name === "weight"
                ? Number(value)
                : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const form = new FormData();

        form.append("id", animal.id);
        form.append("name", formData.name);
        form.append("age", String(formData.age));
        form.append("gender", formData.gender);
        form.append("size", String(formData.size));
        form.append("kind", formData.kind);
        form.append("race", formData.race);
        form.append("weight", String(formData.weight));
        form.append("state", formData.state);
        form.append("city", formData.city);
        form.append("description", formData.description);

        const animalPictureFile = document.getElementById("animalPicture") as HTMLInputElement;
        if (animalPictureFile.files && animalPictureFile.files[0]) {
            form.append("animalPicture", animalPictureFile.files[0]);
        }

        try {
            const response = await api.put(`/animal/${animal.id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if(response.status == 200){
                alert("Alteração bem-sucedida!")
            } else{
                alert("Erro na alteração.")
            }

        } catch (error) {
            console.error("Erro ao cadastrar novo animal", error);
        }

        onSave();
        onClose();
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2 style={{ marginBottom: "30px", fontWeight: "bold", fontSize: "2rem" }}>Editar Animal</h2>

                <div style={contentStyle}>
                    {/* Imagem + Alterar */}
                    <div style={imageSectionStyle}>
                        <img
                            src={previewImage}
                            alt="Animal"
                            style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <input
                            id='animalPicture'
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ marginTop: "10px" }}
                        />
                    </div>

                    {/* Formulário à direita */}
                    <div style={{ flex: 1, marginLeft: "20px" }}>
                        {[
                            { label: "Nome", name: "name", type: "text" },
                            { label: "Idade", name: "age", type: "number" },
                            { label: "Sexo", name: "gender", type: "text" },
                            { label: "Porte", name: "size", type: "number" },
                            { label: "Espécie", name: "kind", type: "text" },
                            { label: "Raça", name: "race", type: "text" },
                            { label: "Estado", name: "state", type: "text" },
                            { label: "Cidade", name: "city", type: "text" },
                            { label: "Peso (kg)", name: "weight", type: "number" }
                        ].map((field) => (
                            field.name == "state" ? (
                                <div style={{ marginBottom: "12px" }}>
                                    <label
                                        htmlFor="state"
                                        style={{
                                            display: "block",
                                            color: "#374151",
                                            marginBottom: "8px",
                                            fontSize: "14px",
                                            fontWeight: 500
                                        }}
                                    >
                                        Estado <span style={{ color: "#ef4444" }}>*</span>
                                    </label>

                                    <select
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handlePetStateChange}
                                        style={{
                                            width: "100%",
                                            padding: "8px 12px",
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <option value="" disabled>Selecione um estado</option>
                                        {States.map(est => (
                                            <option key={est.sigla} value={est.nome}>{est.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            ):
                            field.name == "city" ? (
                                <div style={{ marginBottom: "12px" }}>
                                    <label
                                        htmlFor="city"
                                        style={{
                                        display: "block",
                                        color: "#374151",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: 500
                                        }}
                                    >
                                        Cidade <span style={{ color: "#ef4444" }}>*</span>
                                    </label>

                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        color: (!formData.state || loadingCities) ? "#6b7280" : "#000",
                                        }}
                                    >
                                        <option value={formData.city} selected>{formData.city}</option>
                                        {Cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                            ): (
                                <div key={field.name} style={{ marginBottom: "12px" }}>
                                    <label htmlFor={field.name} style={labelStyle}>{field.label} <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name as keyof AnimalFormData]}                                        
                                        onChange={handleChange}
                                        placeholder={field.label}
                                        style={inputStyle}
                                    />
                                </div>
                            )
                        ))}

                        <div style={{ marginBottom: "12px" }}>
                            <label htmlFor="description" style={labelStyle}>Descrição</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                placeholder="Descrição"
                                style={{ ...inputStyle, height: "60px", resize: "vertical" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Botões */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={onClose} style={cancelButton}>Cancelar</button>
                    <button onClick={handleSubmit} style={confirmButton}>Salvar</button>
                </div>
            </div>
        </div>
    );
}