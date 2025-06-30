import ".././css/style.css"
import ".././css/CardDashBoard.css"

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
}

export default function Card({ animal }: CardProps) {
    return (
        <div className="animal-card">
            <img src={animal.imageUrl} alt={animal.name} className="animal-image" />
            <div className="animal-info">
                <h3 className="animal-name">{animal.name}</h3>
                {/* Se quiser, pode adicionar mais info aqui */}
            </div>
        </div>
    );
}
