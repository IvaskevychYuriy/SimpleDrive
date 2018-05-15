import http from "./core/http";
import { AxiosResponse } from "axios";
import { User } from "../models/User";
import { UserEditModel } from "../models/UserEditModel";

class UsersService {
    
    async get(): Promise<User[]> {
        const result = await http.get<User[]>('users');
        return result.data;
    }

    async update(user: UserEditModel): Promise<void> {
        await http.put(`users`, user);
    }

    async delete(id: number): Promise<void> {
        await http.delete(`users/${id}`);
    }
}

export default new UsersService()