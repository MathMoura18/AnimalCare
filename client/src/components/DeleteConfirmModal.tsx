import { useEffect } from "react";
import { api } from "../services/api";

interface DeleteConfirmModalProps {
    animalId: string;
    onConfirm: () => void;
    onCancel: () => void;
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
    maxWidth: "400px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
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


export function DeleteConfirmModal({ animalId, onConfirm, onCancel }: DeleteConfirmModalProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    async function handleConfirm() {
        const response = await api.delete(`/animal/${animalId}`);

        if(response.status == 200){
            alert("Animal deletado com sucesso!")
        } else{
            alert("Erro ao deletar.")
        }

        onConfirm();

    }


    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h3>Tem certeza que deseja apagar este animal?</h3>
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={onCancel} style={cancelButton}>Cancelar</button>
                    <button onClick={handleConfirm} style={confirmButton}>Apagar</button>
                </div>
            </div>
        </div>
    );
}