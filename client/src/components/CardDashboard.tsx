import ".././css/style.css"
import ".././css/Card.css"
import { Pencil, Trash } from "lucide-react"; // ícone do lápis (instale com: npm install lucide-react)
import { useState } from 'react';
import { EditAnimalModal } from "./EditAnimalModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

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

interface CardProps {
    animal: Animal;
    role: 'ong' | 'customer';
}

export default function Card({ animal, role }: CardProps) {
    const [isEditHover, setIsEditHover] = useState(false);
    const [isDeleteHover, setIsDeleteHover] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const editButtonStyle = {
        backgroundColor: isEditHover ? "#f59e0b" : "#fbbf24", // hover: amarelo mais escuro
        color: "#fff",
        padding: "6px 12px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginRight: "10px"
    };

    const deleteButtonStyle = {
        backgroundColor: isDeleteHover ? "#b91c1c" : "#ef4444", // hover: vermelho mais escuro
        color: "#fff",
        padding: "6px 12px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    };

    return (
        <div className="QAdotarDashboard w-[250px]">
            <img src={animal.imageUrl} alt={animal.name} className="QAdotar-img" />
            <div className="QAdotar-info">
                <h3 >{animal.name}</h3>

                {/* Editar e apagar só para ONG */}
                {role === 'ong' && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", width: "100%", marginBottom: "10px" }}>
                        <button 
                            title="Editar" 
                            style={editButtonStyle}
                            onClick={() => setShowEditModal(true)}
                            onMouseEnter={() => setIsEditHover(true)}
                            onMouseLeave={() => setIsEditHover(false)}
                            >
                            <Pencil className="w-5 h-5 mr-1 " />
                        </button>
                        <button 
                            title="Deletar" 
                            style={deleteButtonStyle}
                            onClick={() => setShowDeleteModal(true)}
                            onMouseEnter={() => setIsDeleteHover(true)}
                            onMouseLeave={() => setIsDeleteHover(false)}
                            >
                            <Trash className=""/>
                        </button>
                    </div>
                )}
            </div>

            {showEditModal && (
                <EditAnimalModal
                    animal={animal}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => window.location.reload()}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmModal
                    animalId={animal.id}
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={() => window.location.reload()}
                />
            )}
        </div>
    );
}