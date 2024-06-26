import { UserM, UserWithoutPassword } from "src/domain/model/user";
import { UserRepository } from "src/domain/repositories/userRepository.interface";

export class IsAuthenticatedUseCases {
    constructor(
        private readonly adminUserRepo: UserRepository
    ) { }

    async execute(username: string): Promise<UserWithoutPassword> {
        const user: UserM = await this.adminUserRepo.getUserByUsername(username);
        const { password, ...info } = user;
        return info;
    }
}