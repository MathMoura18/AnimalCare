import { FastifyRequest, FastifyReply } from 'fastify';
import { OngService } from '../services/OngService'

interface CreateOngProps {
    corporateName: string;
    cnpj: string;
    name: string;
    representative: string;
    contact: string;
    email: string;
    password: string;
    state: string;
    zipcode: string;
    city: string;
    neighborhood: string;
    patio: string;
}

interface EditOngProps {
    corporateName: string;
    cnpj: string;
    name: string;
    representative: string;
    contact: string;
    email: string;
    password: string;
    state: string;
    zipcode: string;
    city: string;
    neighborhood: string;
    patio: string;
}

class OngController {
    async handleListOngs(request: FastifyRequest, reply: FastifyReply){

        const ongService = new OngService();
        const ongs = await ongService.listOngs();

        reply.send(ongs);
    }

    async handleFindOngById(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.params as { id: string };

        if (!id) throw new Error("O campo 'id' é obrigatório.");

        const ongService = new OngService();
        const ong = await ongService.findOngById(id);

        reply.send(ong);
    }

    async handleLoginOng(request: FastifyRequest, reply: FastifyReply){

        const { email, password } = request.body as { email: string, password: string };

        const ongService = new OngService();
        const ong = await ongService.loginOng({email, password});

        reply.setCookie('refreshToken', ong.refreshToken, {
            path: '/', // envia para toda a aplicação
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // apenas HTTPS em produção
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
        });

        reply.send(ong.accessToken);
    }

    async handleCreateOng(request: FastifyRequest, reply: FastifyReply){

        const { 
            corporateName,
            cnpj,
            name,
            representative,
            contact,
            email,
            password,
            state,
            zipcode,
            city,
            neighborhood,
            patio } = request.body as CreateOngProps;

        const ongService = new OngService();
        const ong = await ongService.createOng({ 
            corporateName,
            cnpj,
            name: corporateName, // TODO: verificar uma maneira melhor de ter o nick da ong
            representative,
            contact,
            email,
            password,
            state,
            zipcode,
            city,
            neighborhood,
            patio });

        reply.send(ong);
    }
    
    async handleEditOng(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        
        if(!id){
            throw new Error("O parâmetro 'id' é obrigatório")
        }

        const { 
            corporateName,
            cnpj,
            name,
            representative,
            contact,
            email,
            password,
            state,
            zipcode,
            city,
            neighborhood,
            patio } = request.body as EditOngProps;

        if (password) {
            // Validações da senha
            if (!/[a-z]/.test(password)) throw new Error("A senha deve ter pelo menos 1 letra minúscula.");
            if (!/[A-Z]/.test(password)) throw new Error("A senha deve ter pelo menos 1 letra maiúscula.");
            if (!/[0-9]/.test(password)) throw new Error("A senha deve ter pelo menos 1 número.");
            if (!/[^a-zA-Z0-9\s]/.test(password)) throw new Error("A senha deve ter pelo menos 1 caractere especial.");
        }

        const ongService = new OngService();
        const updatedCustomer = await ongService.editOng({
            id,
            corporateName,
            cnpj,
            name,
            representative,
            contact,
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

    async handleDeleteOng(request: FastifyRequest, reply: FastifyReply){

        const { id } = request.query as { id: string };

        const ongService = new OngService();
        const ong = await ongService.deleteOng({id});

        reply.send(ong);
    }
}

export { OngController };