import prismaClient from "../prisma";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// gerar Token do usuário
dotenv.config();

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

// verifica o refresh token e retorna novo access
export function refreshAccessToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    const newAccessToken = generateAccessToken({ userId: decoded.userId, role: decoded.role });
    return { accessToken: newAccessToken };
  } catch (err) {
    throw new Error("Refresh token inválido ou expirado");
  }
}

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

interface LoginOngProps {
    email: string;
    password: string;
}

interface EditOngProps {
    id: string;
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

interface DeleteOngProps {
    id: string;
}

class OngService {
    async listOngs() {
        const ongs = await prismaClient.ong.findMany();

        return ongs;
    };

    async findOngById(id: string) {
        return await prismaClient.ong.findUnique({ where: { id } });
    }

    async loginOng({ email, password }: { email: string; password: string }) {
        const ong = await prismaClient.ong.findFirst({
            where: { 
                email: email
            }
        });

        if (!ong) throw new Error("ONG não encontrada");

        const passwordMatch = await bcrypt.compare(password, ong.password_hash);
        if (!passwordMatch) throw new Error("Senha incorreta");

        const accessToken = jwt.sign(
            { userId: ong.id, role: "Ong" },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { userId: ong.id, role: "Ong" },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        return { accessToken, refreshToken };
  }

    async createOng({ corporateName, cnpj, name, representative, contact, email, password, state, zipcode, city, neighborhood, patio }: CreateOngProps) {

        if(!corporateName || !cnpj || !name || !representative || !contact || !email || !password || !state || !zipcode || !city || !neighborhood || !patio){
            throw new Error("Preencha todos os campos.")
        }

        const verifyCnpjExist = await prismaClient.ong.findFirst({
            where: {
                cnpj: cnpj
            }
        });

        if (verifyCnpjExist) {
            throw new Error("CNPJ já cadastrado.")
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const ong = await prismaClient.ong.create({
            data: {
                corporateName,
                cnpj,
                name,
                representative,
                contact,
                email,
                password_hash,
                state,
                zipcode,
                city,
                neighborhood,
                patio
            }
        });

        if(ong){
            return { message: 'Ong criado com sucesso!' };
        } else {
            throw new Error("Erro ao criar o ong.")
        }
    }

    async editOng({ 
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
        patio }: EditOngProps) {

        const verifyOngExist = await prismaClient.ong.findUnique({
            where: { id: id },
        });

        if (!verifyOngExist) {
            throw new Error(`ONG de id '${id}' não existe.`)
        }

        const dataToUpdate: any = {
            ...(name && { name }),
            ...(corporateName && { corporateName }),
            ...(cnpj && { cnpj }),
            ...(representative && { representative }),
            ...(contact && { contact }),
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

        const customer = await prismaClient.ong.update({
            where: { id },
            data: dataToUpdate,
        });

        return customer;
    };
    
    async deleteOng({ id }: DeleteOngProps) {

        if(!id){
            throw new Error("Solicitação inválida.");
        }

        const findOng = await prismaClient.ong.findFirst({
            where:{
                id: id
            }
        });

        if(!findOng){
            throw new Error("Ong não existe.");
        }

        await prismaClient.ong.delete({
            where:{
                id: findOng.id
            }
        });

        return {message: `Ong ${findOng.name} (${findOng.id}) deletado com sucesso!`};
    }
}

export { OngService }