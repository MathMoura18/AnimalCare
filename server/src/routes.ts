import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";

import { CustomerController } from "./controllers/CustomerController";
import { AnimalController } from "./controllers/AnimalController";
import { OngController } from "./controllers/OngController";
import { AuthController } from "./controllers/AuthController";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

    //Customers
    fastify.get("/customers", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CustomerController().handleListCustomers(request, reply);
    });

    fastify.get("/customer/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CustomerController().handleFindCustomerById(request, reply);
    });

    fastify.post("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CustomerController().handleCreateCustomer(request, reply);
    });

    fastify.post("/loginCustomer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CustomerController().handleLoginCustomer(request, reply);
    });

    fastify.put("/customer/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CustomerController().handleEditCustomer(request, reply);
    });

    fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
        return new CustomerController().handleDeleteCustomer(request, reply);
    });

    //ONGs
    fastify.get("/ongs", async (request: FastifyRequest, reply: FastifyReply) => {
        return new OngController().handleListOngs(request, reply);
    });

    fastify.get("/ong/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        return new OngController().handleFindOngById(request, reply);
    });

    fastify.post("/loginOng", async (request: FastifyRequest, reply: FastifyReply) => {
        return new OngController().handleLoginOng(request, reply);
    });

    fastify.put("/ong/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        return new OngController().handleEditOng(request, reply);
    });

    fastify.post("/ong", async (request: FastifyRequest, reply: FastifyReply) => {
        return new OngController().handleCreateOng(request, reply);
    });

    fastify.delete("/ong", async (request: FastifyRequest, reply: FastifyReply) => {
        return new OngController().handleDeleteOng(request, reply);
    });

    //Animals
    fastify.get("/animals", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleListAnimals(request, reply);
    });

    fastify.get("/animalsByLocation", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleListAnimalsByLocation(request, reply);
    });

    fastify.get("/animals/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleListAnimalsByUserId(request, reply);
    });

    fastify.post("/animal", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleCreateAnimal(request, reply);
    });
    
    // PD = PARA ADOÇÃO
    fastify.put("/setPDAnimal", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleSetStatusPDAnimal(request, reply);
    });

    // AD = ADOTADO
    fastify.put("/setADAnimal", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleSetStatusADAnimal(request, reply);
    });

    fastify.delete("/animal", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AnimalController().handleDeleteAnimal(request, reply);
    });

    //Auth
    fastify.post("/refresh", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AuthController().handleRefresh(request, reply);
    });

    fastify.get("/me", async (request: FastifyRequest, reply: FastifyReply) => {
        return new AuthController().handleMe(request, reply);
    });
}