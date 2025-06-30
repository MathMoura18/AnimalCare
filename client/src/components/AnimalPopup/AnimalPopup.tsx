import './AnimalPopup.css';

export interface Animal {
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


interface AnimalPopupProps {
  animal: Animal;
  onClose: () => void;
  onAdotar: (animalId: string) => void;
  termoVisivel: boolean;
  termoAceito: boolean;
  setTermoAceito: (aceito: boolean) => void;
  setTermoVisivel: (visivel: boolean) => void;
}

export default function AnimalPopup({
  animal,
  onClose,
  onAdotar,
  termoVisivel,
  termoAceito,
  setTermoAceito,
  setTermoVisivel
}: AnimalPopupProps) {
  return (
    <div className="animal-popup-overlay">
      <div className="animal-popup">
        <div className="animal-popup-left">
          <img src={animal.imageUrl} alt={animal.name} />
        </div>
        <div className="animal-popup-right">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>{animal.name}</h2>
          <div className="info-grid">
            <div><strong>Peso</strong><br />{animal.weight}</div>
            <div><strong>Sexo</strong><br />{animal.gender}</div>
            <div><strong>Espécie</strong><br />{animal.kind}</div>
            <div><strong>Idade</strong><br />{animal.age}</div>
            <div><strong>Raça</strong><br />{animal.race}</div>
            <div><strong>Porte</strong><br />{animal.size}</div>
            <div><strong>Cidade</strong><br />{animal.city}</div>
            <div><strong>Estado</strong><br />{animal.state}</div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Sobre o pet</strong><br />{animal.description}
            </div>
          </div>

          <div className='btn-container'>
            {termoVisivel ? (
              <>
                <h3>Termo de Uso para Adoção</h3>
                <p style={{ whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <label>
                  <input
                    type="checkbox"
                    checked={termoAceito}
                    onChange={(e) => setTermoAceito(e.target.checked)}
                  />{' '}
                  Eu li e aceito os termos de uso.
                </label>
                <button
                  disabled={!termoAceito}
                  onClick={() => onAdotar(animal.id)}
                  style={{
                    marginTop: "1rem",
                    cursor: termoAceito ? "pointer" : "not-allowed",
                    backgroundColor: termoAceito ? "#e5a000" : "#ccc",
                    color: termoAceito ? "white" : "#666",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                  }}
                >
                  Confirmar Adoção
                </button>
                <button
                  onClick={() => setTermoVisivel(false)}
                  style={{ marginLeft: "1rem" }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                className="btn-adotar"
                onClick={() => setTermoVisivel(true)}
              >
                Quero adotar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
