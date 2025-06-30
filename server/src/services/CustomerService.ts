import prismaClient from "../prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// cria Access Token (expira em 1 hora)
export function generateAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// cria Refresh Token (expira em 7 dias)
export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

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
  id: string;
  name?: string;
  cpf?: string;
  dateOfBirth?: string;
  telephone?: string;
  email?: string;
  password?: string;
  state?: string;
  zipcode?: string;
  city?: string;
  neighborhood?: string;
  patio?: string;
}

interface LoginCustomerProps {
    email: string;
    password: string;
}

interface DeleteCustomerProps {
    id: string;
}

class CustomerService {
    async listCustomers() {
        const customers = await prismaClient.customer.findMany();

        return customers;
    };
        
    async findCustomerById(id: string) {
        return await prismaClient.customer.findUnique({ where: { id } });
    };

    async loginCustomer({ email, password }: { email: string; password: string }) {
        const customer = await prismaClient.customer.findFirst({ where: { email: email } });

        if (!customer) throw new Error("Usuário não encontrado");

        const passwordMatch = await bcrypt.compare(password, customer.password_hash);
        if (!passwordMatch) throw new Error("Senha incorreta");

        const accessToken = jwt.sign(
            { userId: customer.id, role: "Customer" },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { userId: customer.id, role: "Customer" },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        return { accessToken, refreshToken };
    };

    async createCustomer({ 
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
            patio }: CreateCustomerProps) {

        if(!name || !cpf || !dateOfBirth || !telephone || !email || !password || !state || !zipcode || !city || !neighborhood || !patio){
            throw new Error("Preencha todos os campos")
        }

        const verifyEmailExist = await prismaClient.customer.findFirst({
            where: {
                OR: [
                    {
                        email: email
                    },
                    {
                        cpf: cpf
                    }
                ]
            }
        });

        if (verifyEmailExist) {
            throw new Error("Email/CPF já cadastrado.")
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const customer = await prismaClient.customer.create({
            data: {
                name,
                cpf,
                dateOfBirth,
                telephone,
                email,
                password_hash,
                state,
                zipcode,
                city,
                neighborhood,
                patio,
                status: true
            }
        });

        return customer;
    };

    async editCustomer({ 
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
        patio }: EditCustomerProps) {

        const verifyCustomerExist = await prismaClient.customer.findUnique({
            where: { id },
        });

        if (!verifyCustomerExist) {
            throw new Error(`Usuário de id '${id}' não existe.`)
        }

        const dataToUpdate: any = {
            ...(name && { name }),
            ...(cpf && { cpf }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(telephone && { telephone }),
            ...(email && { email }),
            ...(state && { state }),
            ...(zipcode && { zipcode }),
            ...(city && { city }),
            ...(neighborhood && { neighborhood }),
            ...(patio && { patio }),
            updated_at: new Date(),
        };

        if (password) {
            const saltRounds = 10;
            const password_hash = await bcrypt.hash(password, saltRounds);
            dataToUpdate.password_hash = password_hash;
        }

        const customer = await prismaClient.customer.update({
            where: { id },
            data: dataToUpdate,
        });

        return customer;
    };

    async deleteCustomer({ id }: DeleteCustomerProps) {

        const findCustomer = await prismaClient.customer.findFirst({
            where:{
                id: id
            }
        });

        if(!findCustomer){
            throw new Error("Customer não existe.");
        }

        await prismaClient.customer.delete({
            where:{
                id: findCustomer.id
            }
        });

        return {message: `Cliente ${findCustomer.name} (${findCustomer.id}) deletado com sucesso!`};
    };
}

export { CustomerService }