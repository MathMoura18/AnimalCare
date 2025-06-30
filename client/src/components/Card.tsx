import ".././css/style.css";
import ".././css/Card.css";

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

interface CardProps {
    animal: Animal;
    onClick?: () => void;
}

export default function Card({ animal, onClick }: CardProps) {
    if (animal.status === 'PD') {
        return (
            <div className="QAdotar" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
                <img src={animal.imageUrl} alt={animal.name} className="QAdotar-img" />
                <div className="QAdotar-info">
                    <h3>{animal.name}</h3>
                    <p>{animal.city}, {animal.state}</p>
                    <button className="QAdotar-button">Quero Adotar</button>
                </div>
            </div>
        );
    }
    return null;
}
