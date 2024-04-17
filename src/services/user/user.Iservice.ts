import UserModel from "../../config/database/models/user";
import { LoginSchema, RegisterUserSchema } from "../../validations/user";

interface IUserService {
    getUser(username: string): Promise<UserModel>
    registerUser(data: RegisterUserSchema): Promise<UserModel>
}

export default IUserService;