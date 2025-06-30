import { FastifyRequest, FastifyReply } from 'fastify';
import { CustomerService } from '../services/CustomerService'

interface CreateCustomerProps {
    name: string;
    cpf: string;
    dateOfBirth: string;
    telephone: string;
    email: string;
    password: string;
    state: string;
    zipcode: string;
    city: string;
    neighborhood: string;
    patio: string;
}

interface EditCustomerProps {
  name: string;
  cpf: string;
  dateOfBirth: string;
  telephone: string;
  email: string;
  password?: string;
  state: string;
  zipcode: string;
  city: string;
  neighborhood: string;
  patio: string;
}

class CustomerController {
    async handleListCustomers(request: FastifyRequest, reply: FastifyReply){

        const customerService = new CustomerService();
        const customers = await customerService.listCustomers();

        reply.send(customers);
    }

    async handleFindCustomerById(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.params as { id: string };

        if (!id) throw new Error("O campo 'id' é obrigatório.");

        const customerService = new CustomerService();
        const customer = await customerService.findCustomerById(id);

        reply.send(customer);
    }
    
    async handleLoginCustomer(request: FastifyRequest, reply: FastifyReply){

        const { email, password } = request.body as { email: string, password: string };

        const customerService = new CustomerService();
        const customer = await customerService.loginCustomer({email, password});

        reply.setCookie('refreshToken', customer.refreshToken, {
            path: '/', // envia para toda a aplicação
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // apenas HTTPS em produção
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
        });

        reply.send(customer.accessToken);
    }

    async handleCreateCustomer(request: FastifyRequest, reply: FastifyReply){

        const { 
        name,
        cpf,
        dateOfBirth,
        telephone,
        email,
        password,
        state,
        zipcode,
        city,
        neighborhood,
        patio } = request.body as CreateCustomerProps;

        // validações da senha
        // letra minúscula
        if (!/[a-z]/.test(password)) {
            throw new Error("A senha deve ter pelo menos 1 letra minúscula.")
        }

        // letra maiúscula
        if(!/[A-Z]/.test(password)){
            throw new Error("A senha deve ter pelo menos 1 letra maiúscula.")
        }

        // número
        if(!/[0-9]/.test(password)){
            throw new Error("A senha deve ter pelo menos 1 número.")
        }

        // caractere especial
        if(!/[^a-zA-Z0-9\s]/.test(password)){
            throw new Error("A senha deve ter pelo menos 1 caractere especial.")
        }

        const customerService = new CustomerService();
        const customer = await customerService.createCustomer({ 
            name,
            cpf,
            dateOfBirth,
            telephone,
            email,
            password,
            state,
            zipcode,
            city,
            neighborhood,
            patio });

        reply.send(customer);
    }

    async handleEditCustomer(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        console.log(id);
        if(!id){
            throw new Error("O parâmetro 'id' é obrigatório")
        }

        const {
            name,
            cpf,
            dateOfBirth,
            telephone,
            email,
            password,
            state,
            zipcode,
            city,
            neighborhood,
            patio
        } = request.body as EditCustomerProps;

        if (password) {
            // Validações da senha
            if (!/[a-z]/.test(password)) throw new Error("A senha deve ter pelo menos 1 letra minúscula.");
            if (!/[A-Z]/.test(password)) throw new Error("A senha deve ter pelo menos 1 letra maiúscula.");
            if (!/[0-9]/.test(password)) throw new Error("A senha deve ter pelo menos 1 número.");
            if (!/[^a-zA-Z0-9\s]/.test(password)) throw new Error("A senha deve ter pelo menos 1 caractere especial.");
        }

        const customerService = new CustomerService();
        const updatedCustomer = await customerService.editCustomer({
            id,
            name,
            cpf,
            dateOfBirth,
            telephone,
            email,
            password,
            state,
            zipcode,
            city,
            neighborhood,
            patio
        });

        return reply.send(updatedCustomer);
    }

    async handleDeleteCustomer(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.query as { id: string };

        if(!id){
            throw new Error("O campo 'id' é obrigatório.");
        }

        const customerService = new CustomerService();
        const customer = await customerService.deleteCustomer({id});

        reply.send(customer);
    }
}

export { CustomerController };