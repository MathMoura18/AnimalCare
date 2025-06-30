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

    async handleListAnimalsByUserId(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.params as any;

        if(!id){
            throw new Error("Erro: parâmetros inválidos.")
        }

        const animalService = new AnimalService();
        const animals = await animalService.listAnimalsByUserId(id);

        reply.send(animals);
    }

    async handleEditAnimal(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.params as { id: string };
        
        if(!id){
            throw new Error("O parâmetro 'id' é obrigatório")
        }

        const {
            name,
            age,
            gender,
            size,
            kind,
            race,
            weight,
            state,
            city,
            description,
            animalPicture
        } = request.body as any;

        if(!id){
            throw new Error("Preencha todos os campos.")
        }

        const animalService = new AnimalService();
        const animal = await animalService.editAnimal(
            id,
            animalPicture,
            name.value,
            Number(age.value),
            gender.value,
            Number(size.value),
            kind.value,
            race.value,
            Number(weight.value),
            state.value,
            city.value,
            description.value );

        reply.send(animal);
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
            status = "PD",
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

        const { id, idUser } = request.body as { id: string, idUser: string };

        if(!id || !idUser){
            throw new Error("Erro: parâmetros inválidos.")
        }

        const animalService = new AnimalService();
        const animal = await animalService.setStatusPDAnimal({id, idUser});

        reply.send(animal);
    }

    async handleSetStatusADAnimal(request: FastifyRequest, reply: FastifyReply){

        const { id, idUser } = request.body as { id: string, idUser: string };

        if(!id || !idUser){
            throw new Error("Erro: parâmetros inválidos.")
        }

        const animalService = new AnimalService();
        const animal = await animalService.setStatusADAnimal({id, idUser});

        reply.send(animal);
    }

    async handleDeleteAnimal(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.params as { id: string };

        const animalService = new AnimalService();
        const animal = await animalService.deleteAnimal({id});

        reply.send(animal);
    }
}

export { AnimalController };