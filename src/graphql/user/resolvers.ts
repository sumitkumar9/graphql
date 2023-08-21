import { CreateUserInterface, UserService } from '../../services/user';
const queries = {
    getUserToken: async (_:any, payload: {email: string, password:string}) => {
        const token = await UserService.getUserToken({email: payload.email, password: payload.password})
        return token;
    }
};

const mutations = {
    createUser: async (_: any, payload:CreateUserInterface) => {
        const res = await UserService.createUser(payload);
        return res.id;
    } 
};

export const resolvers = { queries, mutations };