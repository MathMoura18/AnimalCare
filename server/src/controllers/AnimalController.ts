import { FastifyRequest, FastifyReply } from 'fastify';
import { AnimalService } from '../services/AnimalService'

class AnimalController {
    async handleListAnimals(request: FastifyRequest, reply: FastifyReply){

        const animalService = new AnimalService();
        const animals = await animalService.listAnimals();

        reply.send(animals);
    }

    async handleListAnimalsByLocation(request: FastifyRequest, reply: FastifyReply){

        const { state, city } = request.query as any;

        if(!state || !city){
            throw new Error("Erro: parâmetros inválidos.")
        }

        const animalService = new AnimalService();
        const animals = await animalService.listAnimalsByLocation(state, city);

        reply.send(animals);
    }

    async handleCreateAnimal(request: FastifyRequest, reply: FastifyReply){

        const {
            idUser,
            name,
            age,
            gender,
            size,
            kind,
            race,
            status = "disponível",
            weight,
            state,
            city,
            description,
            animalPicture
        } = request.body as any;

        if(!animalPicture || !name || !age || !gender || !size || !kind || !race || !state || !city){
            throw new Error("Preencha todos os campos.")
        }

        const animalService = new AnimalService();
        const animal = await animalService.createAnimal(
            idUser.value,
            animalPicture,
            name.value,
            Number(age.value),
            gender.value,
            Number(size.value),
            kind.value,
            race.value,
            status.value,
            Number(weight.value),
            state.value,
            city.value,
            description.value );

        reply.send(animal);
    }
    
    async handleSetStatusPDAnimal(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.query as { id: string };

        const animalService = new AnimalService();
        const animal = await animalService.setStatusPDAnimal({id});

        reply.send(animal);
    }

    async handleDeleteAnimal(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.query as { id: string };
        console.log(id);

        const animalService = new AnimalService();
        const animal = await animalService.deleteAnimal({id});

        reply.send(animal);
    }
}

export { AnimalController };