import ".././css/style.css"
import ".././css/Card.css"

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
        <div className="QAdotarDashboard w-[250px]">
            <img src={animal.imageUrl} alt={animal.name} className="QAdotar-img" />
            <div className="QAdotar-info">
                <h3>{animal.name}</h3>
            </div>
        </div>
    );
}
